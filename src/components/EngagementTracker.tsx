'use client';

import { useEffect } from 'react';
import { PRODUCT_PARAMS, track, trackCustom } from '@/lib/pixel';

// Fires ViewContent once the visitor has actually engaged (scrolled a bit or
// stayed 10s) — a cleaner signal for Meta than raw PageView — plus scroll-depth
// custom events that can be used to build warm audiences.
export default function EngagementTracker() {
  useEffect(() => {
    let viewed = false;
    const fired = new Set<number>();
    const view = () => {
      if (viewed) return;
      viewed = true;
      track('ViewContent', PRODUCT_PARAMS);
    };
    const timer = window.setTimeout(view, 10000);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      if (pct > 15) view();
      for (const mark of [50, 90]) {
        if (pct >= mark && !fired.has(mark)) {
          fired.add(mark);
          trackCustom('ScrollDepth', { percent: mark });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
