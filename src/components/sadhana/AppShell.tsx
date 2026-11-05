import Link from 'next/link';
import type { ReactNode } from 'react';
import { whatsappLink } from '@/data/site';
import CreamDecor from '../CreamDecor';
import Icon from '../Icon';
import { Logo } from '../Navbar';
import TabBar from './TabBar';
import { HELP_TEXT, TABS, type PlanOver } from './tabs';

// Frame for every logged-in page: the site's dark logo bar over the chandan-cream band.
// `focused` pages (the day's practice) drop the tab bar so nothing pulls attention away;
// they get a big labelled back link instead, which is clearer for older users than a bare arrow.
export default function AppShell({
  back,
  title,
  focused = false,
  expired,
  children,
}: {
  back?: { href: string; label: string };
  title?: ReactNode;
  focused?: boolean;
  // Plan over: no links into the practice, which is closed, nor to a certificate not yet earned.
  expired?: PlanOver;
  children: ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--gold)]/20 bg-[#2b0b06]/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          {back ? (
            <Link href={back.href} className="-ml-2 flex min-h-12 items-center gap-2 rounded-xl px-2 text-lg font-bold text-[var(--gold)]">
              <Icon name="chevronLeft" className="text-2xl" /> {back.label}
            </Link>
          ) : (
            <Logo />
          )}
          {title && <span className="truncate font-display text-xl text-[#fff1cf]">{title}</span>}
          {!focused && (
            <nav aria-label="साधना मेनू" className="hidden items-center gap-1 md:flex">
              {TABS.filter((t) => !expired || (t.href !== '/sadhana' && (expired === 'finished' || t.href !== '/sadhana/certificate'))).map((t) => (
                <Link key={t.href} href={t.href} className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-[15px] font-semibold text-[var(--foreground)]/85 transition-colors hover:text-[var(--gold)]">
                  <Icon name={t.icon} className="text-[var(--gold)]" /> {t.label}
                </Link>
              ))}
              <a href={whatsappLink(HELP_TEXT)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-[15px] font-semibold text-[var(--foreground)]/85 transition-colors hover:text-[var(--gold)]">
                <Icon name="whatsapp" className="text-[#25d366]" /> मदद
              </a>
            </nav>
          )}
        </div>
      </header>

      <main className="theme-cream relative isolate min-h-[calc(100dvh-4rem)] overflow-clip text-[1.0625rem] text-[var(--maroon)] print:min-h-0 print:bg-white">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[var(--cream)] to-[var(--cream-deep)] print:hidden" aria-hidden="true" />
        <div className="print:hidden"><CreamDecor /></div>
        <div className={`relative mx-auto max-w-3xl px-4 pt-14 sm:px-6 sm:pt-20 print:max-w-none print:p-0 ${focused ? 'pb-12' : 'pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-16'}`}>
          {children}
        </div>
      </main>

      {!focused && <TabBar expired={expired} />}
    </>
  );
}

// The same gold-rimmed card as signup/login, slimmer inside for phones.
export function GoldCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-[1.6rem] bg-gradient-to-b from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_24px_50px_-32px_var(--maroon)] ${className}`}>
      <div className="h-full rounded-[calc(1.6rem-2px)] bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_60%,#f8e9d2)] p-4 sm:p-6">{children}</div>
    </div>
  );
}

// Dark sindoor panel with a gold rim, for the one thing on the page that matters most.
export function DarkCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-[1.6rem] bg-gradient-to-b from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_30px_60px_-30px_var(--maroon)] ${className}`}>
      <div className="relative isolate overflow-hidden rounded-[calc(1.6rem-2px)] bg-[radial-gradient(ellipse_at_top,#7c2414,#2b0b06_85%)] text-[#fff1cf]">{children}</div>
    </div>
  );
}

export const emberButton =
  'cta-shine flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-ember px-5 py-3 text-center text-lg font-bold text-[var(--primary-foreground)] shadow-glow transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100';

export const outlineButton =
  'flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[var(--maroon)]/25 bg-white/60 px-4 py-2 text-center text-base font-bold text-[var(--maroon)] transition-colors active:bg-white';
