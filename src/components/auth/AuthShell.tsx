import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/data/site';
import CreamDecor from '../CreamDecor';
import Icon, { type IconName } from '../Icon';
import { Logo } from '../Navbar';

// Shared frame for payment / thank-you: logo bar, then a chandan-cream band
// with the maroon-ribbon heading used across the landing page.
export default function AuthShell({
  ribbon,
  ribbonIcon = 'flame',
  title,
  sub,
  width = 'max-w-xl',
  children,
}: {
  ribbon: string;
  ribbonIcon?: IconName;
  title: ReactNode;
  sub?: ReactNode;
  width?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            ← होम
          </Link>
        </div>
      </header>

      <main className="theme-cream relative isolate min-h-[calc(100vh-4.5rem)] overflow-clip text-[var(--maroon)]">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[var(--cream)] to-[var(--cream-deep)]" aria-hidden="true" />
        <CreamDecor />
        <div className={`relative mx-auto ${width} px-4 pb-16 pt-20 sm:px-6 sm:pt-24`}>
          <PageHeading ribbon={ribbon} ribbonIcon={ribbonIcon} title={title} sub={sub} />

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-[var(--maroon)]/60">
            मदद चाहिए? WhatsApp: {SITE.whatsappDisplay}
          </p>
        </div>
      </main>
    </>
  );
}

// Maroon ribbon, two-tone title and lotus divider — the landing page's section heading.
export function PageHeading({
  ribbon,
  ribbonIcon = 'flame',
  title,
  sub,
}: {
  ribbon: string;
  ribbonIcon?: IconName;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
        <Icon name={ribbonIcon} className="text-[#f7d77a]" /> {ribbon}
      </span>
      <h1 className="mt-4 font-display text-[2.1rem] leading-tight text-[var(--maroon)] sm:text-5xl">{title}</h1>
      <div className="mt-3 flex items-center justify-center gap-2 text-[var(--primary)]" aria-hidden="true">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
        <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
        <Icon name="lotus" className="text-xl" />
        <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
      </div>
      {sub && <p className="mx-auto mt-3 max-w-md text-base font-medium text-[var(--maroon)]/80 sm:text-lg">{sub}</p>}
    </div>
  );
}

// Gold-rimmed cream card used for each form.
const CARD_SURFACE = 'bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_60%,#f8e9d2)]';

export function AuthCard({ surface = CARD_SURFACE, padding = 'p-5 sm:p-8', children }: { surface?: string; padding?: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.6rem] bg-gradient-to-b from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_30px_60px_-35px_var(--maroon)]">
      <div className={`theme-cream relative rounded-[calc(1.6rem-2px)] ${surface} ${padding}`}>
        <div className="pointer-events-none absolute inset-1.5 rounded-[1.4rem] border border-[var(--gold)]/35" aria-hidden="true" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

export const inputClass =
  'h-12 w-full rounded-xl border border-[var(--maroon)]/20 bg-white px-4 text-base text-[var(--maroon)] placeholder:text-[var(--maroon)]/40 outline-none transition focus:border-[var(--sindoor)] focus:ring-2 focus:ring-[var(--sindoor)]/20';

export const labelClass = 'mb-1.5 block text-sm font-bold text-[var(--maroon)]';

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {children}
    </p>
  );
}
