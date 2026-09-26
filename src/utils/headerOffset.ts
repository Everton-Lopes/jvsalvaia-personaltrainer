/**
 * Single source of truth for the fixed-header offset used by anchor navigation.
 *
 * The offset is the ACTUAL rendered bottom edge of `#main-header` (the header is
 * fixed at the top of the viewport). The value is exposed to CSS through the
 * `--header-offset` custom property so native fragment navigation
 * (`scroll-margin-top`) and the JavaScript scroll helper share exactly ONE
 * measured value, with no hardcoded/compounded offsets.
 *
 * The mobile/tablet dropdown lives inside <header>, so its rendered height and
 * top margin are subtracted to keep the offset equal to the visible header bar.
 */

const HEADER_ID = 'main-header';
const DROPDOWN_ID = 'mobile-tablet-menu-dropdown';

export const HEADER_OFFSET_VAR = '--header-offset';

/** Allowed difference between the section top and the header bottom (CSS px). */
const ALIGN_TOLERANCE_PX = 1;

/** Safety limit for the post-scroll correction passes. */
const MAX_CORRECTION_PASSES = 4;

function getHeader(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById(HEADER_ID);
}

function currentScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
}

function maxScrollTop(): number {
  const doc = document.documentElement;
  return Math.max(0, (doc.scrollHeight || 0) - window.innerHeight);
}

function clampScroll(top: number): number {
  return Math.min(Math.max(top, 0), maxScrollTop());
}

/**
 * Actual rendered bottom edge of the fixed header, in viewport coordinates.
 * The header is fixed at the top of the viewport, so its bottom equals its
 * visible height (padding included). When the mobile/tablet dropdown is open it
 * lives inside the same element, so its height and top margin are removed.
 *
 * The header animates its vertical padding between the "top" and "scrolled"
 * states. In resized/throttled webviews that transition can be delayed, stuck on
 * an intermediate value, or applied on a later frame, so the animated geometry
 * is NOT a reliable anchor target. Measurement therefore neutralises the
 * transition for the read only, yielding the header's real TARGET geometry and
 * keeping this measured value in sync with where the header actually settles.
 */
function renderedHeaderBottom(): number {
  const header = getHeader();
  if (!header) return 0;

  const previousTransition = header.style.transitionProperty;
  header.style.transitionProperty = 'none';
  let bottom = header.getBoundingClientRect().bottom;
  header.style.transitionProperty = previousTransition;

  const dropdown = document.getElementById(DROPDOWN_ID);
  if (dropdown) {
    bottom -= dropdown.getBoundingClientRect().height;
    const marginTop = Number.parseFloat(getComputedStyle(dropdown).marginTop);
    if (Number.isFinite(marginTop)) bottom -= marginTop;
  }

  return Math.max(0, bottom);
}

/** Measures the header and writes the value to the `--header-offset` CSS property. */
export function applyHeaderOffset(): number {
  if (typeof document === 'undefined') return 0;
  const value = renderedHeaderBottom();
  document.documentElement.style.setProperty(HEADER_OFFSET_VAR, `${value}px`);
  return value;
}

function scrollWithBehavior(top: number, behavior: ScrollBehavior): void {
  const destination = clampScroll(top);

  if (behavior === 'smooth') {
    window.scrollTo({ top: destination, behavior: 'smooth' });
    return;
  }

  // Force an instant jump even though the document opts into smooth scrolling.
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo({ top: destination, behavior: 'auto' });
  html.style.scrollBehavior = previous;
}

/**
 * Scroll position that places the top of `target` exactly at `headerBottom`.
 */
function destinationFor(target: HTMLElement, headerBottom: number): number {
  return target.getBoundingClientRect().top + currentScrollTop() - headerBottom;
}

/**
 * Signed mismatch between the target section top and the header bottom, in
 * viewport coordinates. Zero means a perfect alignment.
 */
function alignmentError(target: HTMLElement): number {
  return target.getBoundingClientRect().top - renderedHeaderBottom();
}

/**
 * Waits for the smooth scroll to settle, then measures the REAL final position
 * of the target against the REAL rendered header bottom and corrects any
 * residual mismatch with an instant scroll. The measurement/correction loop is
 * repeated a bounded number of times because correcting the position can itself
 * change the header (scrolled padding transition) or trigger late layout work.
 */
function settleAndAlign(target: HTMLElement, onSettled?: () => void): void {
  let raf = 0;
  let cancelled = false;
  let passes = 0;
  let stableFrames = 0;
  let lastTop = currentScrollTop();
  let lastHeaderBottom = renderedHeaderBottom();
  let startedAt = performance.now();

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    window.cancelAnimationFrame(raf);
    applyHeaderOffset();
    onSettled?.();
  };

  const tick = () => {
    if (cancelled) return;

    const nowTop = currentScrollTop();
    const nowHeaderBottom = renderedHeaderBottom();

    // Both the page position AND the rendered header geometry must be stable:
    // the header animates its padding when it enters the "scrolled" state, so
    // measuring during that transition would align to a stale height.
    const still =
      Math.abs(nowTop - lastTop) < 0.5 &&
      Math.abs(nowHeaderBottom - lastHeaderBottom) < 0.25;

    lastTop = nowTop;
    lastHeaderBottom = nowHeaderBottom;
    stableFrames = still ? stableFrames + 1 : 0;

    const elapsed = performance.now() - startedAt;

    if ((stableFrames >= 5 && elapsed > 250) || elapsed > 1800) {
      const delta = alignmentError(target);
      applyHeaderOffset();

      if (Math.abs(delta) > ALIGN_TOLERANCE_PX && passes < MAX_CORRECTION_PASSES) {
        passes += 1;
        const before = currentScrollTop();
        scrollWithBehavior(before + delta, 'auto');
        const after = currentScrollTop();

        if (Math.abs(after - before) > 0.5) {
          // The page actually moved: let it render, then verify again.
          stableFrames = 0;
          lastTop = after;
          lastHeaderBottom = renderedHeaderBottom();
          startedAt = performance.now();
          raf = window.requestAnimationFrame(tick);
          return;
        }
      }

      finish();
      return;
    }

    raf = window.requestAnimationFrame(tick);
  };

  raf = window.requestAnimationFrame(tick);
}

/**
 * Cancels the guard of a previous alignment. Only one guard may be live at a
 * time so a new navigation never fights a stale one.
 */
let stopActiveGuard: (() => void) | null = null;

/**
 * Some browsers/webviews run a deferred native fragment scroll or a late layout
 * pass after the first paint, which can move the page away from the aligned
 * position. rAF-driven settling is also suspended while the page is
 * backgrounded, so a timer-based guard is the only reliable safety net.
 *
 * The guard is BOUNDED (auto-stops after `windowMs`), only corrects once the
 * scroll position has been stable across two consecutive ticks (so it never
 * fights an in-flight smooth scroll or the user), and stops immediately on any
 * user interaction. Only one guard may be live at a time.
 */
function guardAlignment(target: HTMLElement, windowMs = 3200): void {
  stopActiveGuard?.();

  let autoStopTimer = 0;
  let stopped = false;
  let lastTop = -1;
  let stableTicks = 0;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearInterval(interval);
    window.clearTimeout(autoStopTimer);
    window.removeEventListener('wheel', handleUser);
    window.removeEventListener('touchstart', handleUser);
    window.removeEventListener('pointerdown', handleUser);
    window.removeEventListener('keydown', handleUser);
    if (stopActiveGuard === stop) stopActiveGuard = null;
  };

  const handleUser = () => stop();

  const validate = () => {
    if (stopped) return;

    const top = currentScrollTop();

    // Never interfere while a smooth/user scroll is still moving the page.
    if (Math.abs(top - lastTop) > 1) {
      lastTop = top;
      stableTicks = 0;
      return;
    }

    stableTicks += 1;
    if (stableTicks < 2) return;

    // Re-measure BOTH the real target position and the real header bottom:
    // late native fragment scrolling AND late header geometry changes can each
    // desynchronise the alignment without ever firing a `scroll` event.
    const delta = alignmentError(target);
    applyHeaderOffset();

    if (Math.abs(delta) <= ALIGN_TOLERANCE_PX) return;

    const before = top;
    scrollWithBehavior(before + delta, 'auto');
    lastTop = currentScrollTop();
    stableTicks = 0;

    if (Math.abs(lastTop - before) <= 0.5) {
      // The document cannot physically reach the aligned position (e.g. the
      // top of the page); stop retrying.
      stop();
    }
  };

  const interval = window.setInterval(validate, 200);

  stopActiveGuard = stop;

  autoStopTimer = window.setTimeout(stop, windowMs);

  window.addEventListener('wheel', handleUser, { passive: true });
  window.addEventListener('touchstart', handleUser, { passive: true });
  window.addEventListener('pointerdown', handleUser);
  window.addEventListener('keydown', handleUser);
}

export interface ScrollToAnchorOptions {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
}

/**
 * Scrolls so the top of the target section sits exactly at the bottom of the
 * currently rendered fixed header. Afterwards the final position is measured
 * and corrected so `|target.top - header.bottom| <= 1px` whenever the document
 * can physically reach that position (the top of the page is clamped to 0, so
 * `#hero` cannot place itself above the viewport).
 */
export function scrollToAnchor(
  id: string,
  { behavior = 'smooth', updateHash = true }: ScrollToAnchorOptions = {}
): void {
  if (typeof document === 'undefined') return;

  const target = document.getElementById(id);
  if (!target) return;

  // A new navigation invalidates any guard from a previous one.
  stopActiveGuard?.();

  const headerBottom = applyHeaderOffset();
  scrollWithBehavior(destinationFor(target, headerBottom), behavior);
  settleAndAlign(target, () => guardAlignment(target));

  if (updateHash) {
    try {
      window.history.pushState(null, '', `#${id}`);
    } catch {
      // Ignore environments that disallow history updates.
    }
  }
}
