// Older users often find default text too small. The choice scales the root font size, so every
// rem-based size on the site grows with it. An inline script in the root layout applies it before
// first paint. Key shared with nothing else: it lives in this site's own browser storage.
export const TEXT_SIZE_KEY = 'hs_text_size';
export const TEXT_SIZES = [
  { id: 'normal', label: 'सामान्य', scale: '100%', sample: 'text-base' },
  { id: 'large', label: 'बड़ा', scale: '112.5%', sample: 'text-lg' },
  { id: 'xl', label: 'सबसे बड़ा', scale: '125%', sample: 'text-xl' },
] as const;
