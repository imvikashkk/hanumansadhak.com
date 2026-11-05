declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, params);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('trackCustom', event, params);
}

// Same product params on every event so Meta ties them to one product.
export const PRODUCT_PARAMS = {
  content_name: '40 दिन हनुमान स्तुति साधना',
  content_ids: ['hanuman-40'],
  content_type: 'product',
};
