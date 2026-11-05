'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const GIVE_UP_MS = 15000;

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const here = `${pathname}?${search}`;
  // The page a link was clicked on. The bar shows while we're still on it, so it needs no "finished"
  // signal: arriving anywhere else ends it, including where a redirect led instead.
  const [leaving, setLeaving] = useState<string | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page, or a #section
      setLeaving(`${location.pathname}?${location.search.slice(1)}`);
    }
    // Capture phase: next/link calls preventDefault on its clicks, and it runs before a bubbling listener.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setLeaving(null), GIVE_UP_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (leaving !== here) return null;
  return <div className="nav-progress fixed left-0 top-0 z-[100] h-[3px] bg-ember shadow-[0_0_10px_var(--gold)] print:hidden" role="progressbar" aria-label="पेज खुल रहा है" />;
}

// A thin bar along the top from the moment a link is tapped, so a slow connection never looks like
// a tap that did nothing.
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
