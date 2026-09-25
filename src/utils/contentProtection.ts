/**
 * Global content protection against casual visitor interactions
 * (text selection, copy/cut, image dragging and native context menu).
 *
 * This is a deterrent barrier for common browser interactions, NOT absolute
 * content protection. Advanced users can still obtain assets via DevTools,
 * network requests, cache or screenshots.
 *
 * Editable fields and explicitly allowed areas keep full native behavior.
 */

const EDITABLE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'option',
  '[contenteditable="true"]',
  '[contenteditable=""]',
  '[contenteditable="plaintext-only"]',
  '[data-selectable]',
  '.allow-select',
].join(',');

let initialized = false;

function getElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof Node) return target.parentElement;
  return null;
}

function isEditableTarget(target: EventTarget | null): boolean {
  const el = getElement(target);
  return Boolean(el && el.closest(EDITABLE_SELECTOR));
}

function isEditableActiveElement(): boolean {
  const active = document.activeElement;
  return active instanceof Element && Boolean(active.closest(EDITABLE_SELECTOR));
}

function isSelectionInsideEditable(): boolean {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const anchor = selection.anchorNode;
  const el = getElement(anchor);
  return Boolean(el && el.closest(EDITABLE_SELECTOR));
}

function allowsNativeBehavior(event: Event): boolean {
  return (
    isEditableTarget(event.target) ||
    isEditableActiveElement() ||
    isSelectionInsideEditable()
  );
}

function handleContextMenu(event: MouseEvent): void {
  if (allowsNativeBehavior(event)) return;
  event.preventDefault();
}

function handleCopyOrCut(event: ClipboardEvent): void {
  if (allowsNativeBehavior(event)) return;
  event.preventDefault();
}

function handleDragStart(event: DragEvent): void {
  if (allowsNativeBehavior(event)) return;
  event.preventDefault();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (allowsNativeBehavior(event)) return;

  const isCopyShortcut =
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    (event.key === 'c' || event.key === 'C');
  const isCutShortcut =
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    (event.key === 'x' || event.key === 'X');
  // Ctrl+Insert copies on Windows; Shift+Insert (paste) must keep working.
  const isInsertCopyShortcut =
    event.ctrlKey && !event.shiftKey && !event.altKey && event.key === 'Insert';

  if (isCopyShortcut || isCutShortcut || isInsertCopyShortcut) {
    event.preventDefault();
  }
}

export function initContentProtection(): void {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  document.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('copy', handleCopyOrCut, true);
  document.addEventListener('cut', handleCopyOrCut, true);
  document.addEventListener('dragstart', handleDragStart, true);
  document.addEventListener('keydown', handleKeyDown, true);
}
