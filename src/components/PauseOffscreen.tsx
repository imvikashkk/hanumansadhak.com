'use client';

import { useEffect } from 'react';

// The page runs ~200 decorative CSS animations (turning mandalas, sparks, petals…).
// Sections off screen get data-paused, and globals.css freezes every animation inside
// them — only what the visitor can see keeps moving.
export default function PauseOffscreen() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = document.querySelectorAll<HTMLElement>('main > section, main > div:not([data-site-header])');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) delete el.dataset.paused;
          else el.dataset.paused = '';
        }
      },
      { rootMargin: '200px 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
