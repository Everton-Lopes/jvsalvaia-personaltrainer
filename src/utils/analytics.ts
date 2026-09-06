/**
 * Camada de Rastreamento Profissional de Conversões, UTMs e Consentimento LGPD
 * Suporte integrado: Google Analytics 4 (gtag), Meta Pixel (fbq), Google Tag Manager (dataLayer)
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface WhatsAppTrackingData {
  ctaLocation: string;
  section?: string;
  serviceId?: string;
}

const UTM_STORAGE_KEY = 'jv_salvaia_utm_params';
const CONSENT_STORAGE_KEY = 'jv_cookie_consent';

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as ConsentState;
    }
  } catch {
    // Fail silently
  }
  return null;
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function captureUtmParams(consent?: ConsentState | null): UtmParams {
  if (typeof window === 'undefined') return {};
  const activeConsent = consent || getStoredConsent();
  if (!activeConsent || (!activeConsent.analytics && !activeConsent.marketing)) {
    return {};
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utms: UtmParams = {};

    if (activeConsent.analytics) {
      const analyticsKeys: (keyof UtmParams)[] = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
      ];
      analyticsKeys.forEach((key) => {
        const val = urlParams.get(key);
        if (val) utms[key] = val;
      });
    }

    if (activeConsent.marketing) {
      const marketingKeys: (keyof UtmParams)[] = ['gclid', 'fbclid'];
      marketingKeys.forEach((key) => {
        const val = urlParams.get(key);
        if (val) utms[key] = val;
      });
    }

    if (Object.keys(utms).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms));
      return utms;
    }

    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {
    // Fail silently
  }
  return {};
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  const consent = getStoredConsent();
  if (!consent || (!consent.analytics && !consent.marketing)) {
    return {};
  }
  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as UtmParams;
      const filtered: UtmParams = {};
      if (consent.analytics) {
        if (parsed.utm_source) filtered.utm_source = parsed.utm_source;
        if (parsed.utm_medium) filtered.utm_medium = parsed.utm_medium;
        if (parsed.utm_campaign) filtered.utm_campaign = parsed.utm_campaign;
        if (parsed.utm_term) filtered.utm_term = parsed.utm_term;
        if (parsed.utm_content) filtered.utm_content = parsed.utm_content;
      }
      if (consent.marketing) {
        if (parsed.gclid) filtered.gclid = parsed.gclid;
        if (parsed.fbclid) filtered.fbclid = parsed.fbclid;
      }
      return filtered;
    }
  } catch {
    // Fail silently
  }
  return {};
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

function removeTrackingScripts() {
  if (typeof document === 'undefined') return;
  ['ga4-script', 'gtm-script', 'meta-pixel-script'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

export function setupTrackingTags(consent?: ConsentState | null) {
  if (!consent || typeof window === 'undefined') return;
  const env = (import.meta as any).env || {};
  const gaId = env.VITE_GA_MEASUREMENT_ID;
  const pixelId = env.VITE_META_PIXEL_ID;
  const gtmId = env.VITE_GTM_ID;

  if (gtmId && consent.analytics && !document.getElementById('gtm-script')) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`, 'gtm-script').catch(() => {});
  }

  if (gaId && consent.analytics && !document.getElementById('ga4-script')) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, 'ga4-script')
      .then(() => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(..._args: any[]) {
          (window as any).dataLayer.push(arguments);
        }
        (window as any).gtag = (window as any).gtag || gtag;
        gtag('js', new Date());
        gtag('config', gaId, {
          page_path: window.location.pathname,
          anonymize_ip: true,
        });
      })
      .catch(() => {});
  }

  if (pixelId && consent.marketing && !document.getElementById('meta-pixel-script')) {
    const f: any = window;
    if (!f._fbq) {
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      loadScript('https://connect.facebook.net/en_US/fbevents.js', 'meta-pixel-script')
        .then(() => {
          f.fbq('init', pixelId);
          f.fbq('track', 'PageView');
        })
        .catch(() => {});
    }
  }
}

export function updateConsent(consent: { analytics: boolean; marketing: boolean }) {
  if (typeof window === 'undefined') return;
  const consentState: ConsentState = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
  } catch {
    // Fail silently
  }

  if (consent.analytics || consent.marketing) {
    captureUtmParams(consentState);
  } else {
    try {
      sessionStorage.removeItem(UTM_STORAGE_KEY);
    } catch {
      // Fail silently
    }
  }

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    });
  }

  if (typeof (window as any).fbq === 'function') {
    if (consent.marketing) {
      (window as any).fbq('consent', 'grant');
    } else {
      (window as any).fbq('consent', 'revoke');
    }
  }

  if (consent.analytics || consent.marketing) {
    setupTrackingTags(consentState);
  }

  window.dispatchEvent(new CustomEvent('jv_consent_updated', { detail: consentState }));
}

export function resetConsent() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch {
    // Fail silently
  }

  removeTrackingScripts();

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('consent', 'revoke');
  }

  window.dispatchEvent(new CustomEvent('jv_cookie_reset'));
  window.dispatchEvent(new CustomEvent('jv_consent_updated', { detail: null }));
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  const savedConsent = getStoredConsent();
  if (!savedConsent) return;
  if (savedConsent.analytics || savedConsent.marketing) {
    captureUtmParams(savedConsent);
    setupTrackingTags(savedConsent);
  }
}

export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  const consent = getStoredConsent();
  if (!consent || !consent.analytics) return;

  const utms = getStoredUtmParams();
  const payload = {
    event: eventName,
    device: getDeviceType(),
    page_location: window.location.href,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...utms,
    ...eventParams,
  };

  if ((window as any).dataLayer) {
    (window as any).dataLayer.push(payload);
  }
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, payload);
  }
}

export function trackWhatsAppClick(data: WhatsAppTrackingData) {
  const consent = getStoredConsent();
  const utms = getStoredUtmParams();

  const payload = {
    cta_location: data.ctaLocation,
    section: data.section || data.ctaLocation,
    service_id: data.serviceId || 'geral',
    device: getDeviceType(),
    ...utms,
  };

  if (consent?.analytics) {
    trackEvent('whatsapp_click', payload);
  }
  if (consent?.marketing && typeof (window as any).fbq === 'function') {
    (window as any).fbq('trackCustom', 'WhatsAppClick', payload);
    (window as any).fbq('track', 'Contact', {
      content_name: data.serviceId || 'personal_trainer',
      content_category: data.ctaLocation,
    });
  }
}
