import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';
import { Logo } from '../Navbar';
import AdminLogoutButton from './LogoutButton';

const NAV: { href: string; id: string; label: string; icon: IconName }[] = [
  { href: '/admin', id: 'overview', label: 'Overview', icon: 'grid' },
  { href: '/admin/payments', id: 'payments', label: 'Payments', icon: 'coins' },
  { href: '/admin/sadhak', id: 'sadhak', label: 'साधक', icon: 'users' },
];

export default function AdminShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="theme-cream min-h-dvh bg-[#f8efe0] text-[var(--maroon)]">
      <header className="sticky top-0 z-30 border-b border-[var(--gold)]/30 bg-[#2b0b06] text-[#fff1cf]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="[&_img]:h-10 sm:[&_img]:h-12"><Logo /></div>
            <span className="rounded-full border border-[var(--gold)]/40 px-2.5 py-0.5 text-xs font-bold text-[#f7d77a]">Admin</span>
          </div>
          <nav aria-label="Admin" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => <NavLink key={n.id} item={n} on={active === n.id} />)}
          </nav>
          <AdminLogoutButton />
        </div>
        <nav aria-label="Admin" className="flex border-t border-white/10 md:hidden">
          {NAV.map((n) => <NavLink key={n.id} item={n} on={active === n.id} wide />)}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">{children}</main>
    </div>
  );
}

function NavLink({ item, on, wide = false }: { item: (typeof NAV)[number]; on: boolean; wide?: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={on ? 'page' : undefined}
      className={`flex min-h-11 items-center justify-center gap-1.5 text-sm font-semibold ${wide ? 'flex-1' : 'rounded-lg px-3'} ${on ? 'bg-white/10 text-[#f7d77a]' : 'text-[#fff1cf]/80 hover:text-[#f7d77a]'}`}
    >
      <Icon name={item.icon} /> {item.label}
    </Link>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl leading-tight">{title}</h1>
        {sub && <p className="text-sm text-[var(--maroon)]/75">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--maroon)]/12 bg-white/75 p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-xl leading-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, note, strong = false }: { label: string; value: string | number; note?: string; strong?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3.5 sm:p-4 ${strong ? 'border-transparent bg-[radial-gradient(ellipse_at_top,#7c2414,#2b0b06)] text-[#fff1cf]' : 'border-[var(--maroon)]/12 bg-white/75'}`}>
      <p className={`text-[13px] font-semibold ${strong ? 'text-[#fff1cf]/80' : 'text-[var(--maroon)]/70'}`}>{label}</p>
      <p className={`mt-0.5 font-display text-[1.7rem] leading-tight tabular-nums ${strong ? 'text-[#f7d77a]' : ''}`}>{value}</p>
      {note && <p className={`text-xs ${strong ? 'text-[#fff1cf]/70' : 'text-[var(--maroon)]/65'}`}>{note}</p>}
    </div>
  );
}

const STATUS: Record<string, { label: string; cls: string; icon: IconName }> = {
  success: { label: 'सफल', cls: 'bg-green-100 text-green-800', icon: 'check' },
  pending: { label: 'पेंडिंग', cls: 'bg-amber-100 text-amber-900', icon: 'clock' },
  failed: { label: 'असफल', cls: 'bg-red-100 text-red-800', icon: 'close' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: 'bg-stone-100 text-stone-700', icon: 'clock' as IconName };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${s.cls}`}>
      <Icon name={s.icon} /> {s.label}
    </span>
  );
}

export function rupees(paise: number | string): string {
  return `₹${(Number(paise) / 100).toLocaleString('en-IN')}`;
}

export function Pager({ page, total, size, href }: { page: number; total: number; size: number; href: (page: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (pages <= 1) return null;
  const cls = 'flex min-h-10 items-center gap-1 rounded-lg border border-[var(--maroon)]/20 bg-white/70 px-3 text-sm font-semibold';
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      {page > 1 ? <Link className={cls} href={href(page - 1)}><Icon name="chevronLeft" /> पिछला</Link> : <span />}
      <span className="text-sm text-[var(--maroon)]/75">पेज {page} / {pages}</span>
      {page < pages ? <Link className={cls} href={href(page + 1)}>अगला <Icon name="chevronRight" /></Link> : <span />}
    </div>
  );
}

export const fieldClass = 'h-10 w-full rounded-lg border border-[var(--maroon)]/20 bg-white px-3 text-sm text-[var(--maroon)] outline-none focus:border-[var(--sindoor)]';
export const exportClass = 'flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--maroon)]/25 bg-white/70 px-3 text-sm font-semibold';
