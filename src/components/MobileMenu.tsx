'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CheckoutButton from './CheckoutButton';
import Icon from './Icon';

// Below lg: a ☰ button that drops down the section links + Login + Join.
// Also drives the phone-only auto-hide header: scrolling down hides banner + navbar,
// scrolling up brings them back (CSS in globals.css keys off html[data-header-hidden]).
export default function MobileMenu({ links, page }: { links: { href: string; label: string }[]; page?: 'signup' | 'login' | 'payment' | 'sadhak' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const html = document.documentElement;
      if (y < 120 || y < lastY - 6) delete html.dataset.headerHidden;
      else if (y > lastY + 6) html.dataset.headerHidden = '';
      if (Math.abs(y - lastY) > 6) lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      delete document.documentElement.dataset.headerHidden;
    };
  }, []);

  // Close on Escape, a tap outside, or as soon as the page scrolls.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'मेनू बंद करें' : 'मेनू खोलें'}
        className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--gold)]/30 bg-white/5 text-xl text-[var(--gold)] transition hover:bg-white/10"
      >
        <Icon name={open ? 'close' : 'menu'} />
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="मुख्य"
          className="absolute inset-x-0 top-full border-b border-[var(--gold)]/20 bg-[#1a0604]/95 px-4 pb-5 pt-2 shadow-[0_20px_40px_-20px_black] backdrop-blur-md"
        >
          <ul className="grid grid-cols-2 gap-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-[15px] font-medium text-[var(--foreground)]/90 transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className={`mt-4 grid gap-2 ${page ? '' : 'grid-cols-[auto_1fr]'}`}>
            {page !== 'login' && page !== 'payment' && (
              <Link
                href="/login"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--gold)]/40 px-4 text-sm font-bold text-[var(--gold)]"
              >
                <Icon name="lock" /> Login
              </Link>
            )}
            {page !== 'signup' && page !== 'payment' && (
              <CheckoutButton placement="mobile-menu" tone="red" size="sm" className="h-11 w-full">
                <Icon name="flame" /> जॉइन करें
              </CheckoutButton>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
