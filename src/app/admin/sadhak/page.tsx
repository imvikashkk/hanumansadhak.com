import type { Metadata } from 'next';
import Link from 'next/link';
import AdminShell, { exportClass, fieldClass, PageTitle, Pager, Panel, rupees } from '@/components/admin/AdminShell';
import Icon from '@/components/Icon';
import { requireAdmin } from '@/lib/admin-auth';
import { getSadhaks, PAGE_SIZE, planLabel, sadhakFilters, SEGMENTS, type SadhakRow } from '@/lib/admin-data';
import { migrate } from '@/lib/migrate';
import { SADHANA_DAYS } from '@/lib/sadhana';

export const metadata: Metadata = { title: 'Admin — साधक', robots: { index: false, follow: false } };

type Search = Record<string, string | string[] | undefined>;

function PlanCell({ s }: { s: SadhakRow }) {
  if (!s.plan) return <span className="text-[var(--maroon)]/60">बिना भुगतान</span>;
  return (
    <>
      <span className="font-semibold">{planLabel(s.plan)}</span>
      {s.expired ? <span className="block text-xs font-semibold text-red-700">समाप्त: {s.expires}</span> : s.expires && <span className="block text-xs text-[var(--maroon)]/70">{s.expires} तक</span>}
    </>
  );
}

function Progress({ done }: { done: number }) {
  const shown = Math.min(done, SADHANA_DAYS);
  return (
    <span className="block min-w-24">
      <span className="text-sm font-semibold tabular-nums">{shown} / {SADHANA_DAYS}</span>
      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--maroon)]/12">
        <span className="block h-full rounded-full bg-[var(--sindoor)]" style={{ width: `${(shown / SADHANA_DAYS) * 100}%` }} />
      </span>
    </span>
  );
}

export default async function AdminSadhaks({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  await migrate();
  const search = await searchParams;
  const get = (key: string) => (typeof search[key] === 'string' ? (search[key] as string) : undefined);
  const f = sadhakFilters(get);
  const page = Math.max(1, Math.floor(Number(get('page'))) || 1);
  const { rows, total } = await getSadhaks(f, page);
  const query = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);

  return (
    <AdminShell active="sadhak">
      <PageTitle title="साधक" sub={`${total} लोग`} action={<a href={`/api/admin/export?type=sadhak&${query}`} className={exportClass}><Icon name="download" /> CSV</a>} />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {SEGMENTS.map((s) => {
          const q = new URLSearchParams(f.q ? { q: f.q } : {});
          if (s.id) q.set('segment', s.id);
          return (
            <Link key={s.id} href={`/admin/sadhak?${q}`} aria-current={s.id === f.segment ? 'true' : undefined} className={`flex min-h-10 shrink-0 items-center rounded-full border px-3.5 text-sm font-semibold ${s.id === f.segment ? 'border-transparent bg-[var(--maroon)] text-[#fff1cf]' : 'border-[var(--maroon)]/20 bg-white/70'}`}>
              {s.label}
            </Link>
          );
        })}
      </div>

      <form className="mt-3 flex gap-2">
        {f.segment && <input type="hidden" name="segment" value={f.segment} />}
        <label htmlFor="q" className="sr-only">खोजें</label>
        <input id="q" name="q" defaultValue={f.q} placeholder="नाम, नंबर या शहर" className={fieldClass} />
        <button type="submit" className="h-10 shrink-0 rounded-lg bg-ember px-4 text-sm font-bold text-[var(--primary-foreground)]">खोजें</button>
      </form>

      <Panel className="mt-4">
        {!rows.length && <p className="py-8 text-center text-[var(--maroon)]/70">कोई साधक नहीं मिला</p>}
        {rows.length > 0 && (
          <>
            <ul className="divide-y divide-[var(--maroon)]/10 md:hidden">
              {rows.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/sadhak/${s.id}`} className="block py-3">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{s.name || '(बिना नाम)'}</span>
                        <span className="block text-sm tabular-nums text-[var(--maroon)]/75">+91 {s.phone}{s.city ? ` · ${s.city}` : ''}</span>
                      </span>
                      <span className="shrink-0 text-right text-sm"><PlanCell s={s} /></span>
                    </span>
                    <span className="mt-2 block"><Progress done={s.done} /></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--maroon)]/15 text-xs text-[var(--maroon)]/70">
                    <th className="py-2 pr-3 font-semibold">साधक</th><th className="pr-3 font-semibold">शहर</th><th className="pr-3 font-semibold">प्लान</th>
                    <th className="pr-3 font-semibold">प्रगति</th><th className="pr-3 font-semibold">आखिरी साधना</th><th className="pr-3 text-right font-semibold">कुल भुगतान</th><th className="font-semibold">जुड़े</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className="border-b border-[var(--maroon)]/8 last:border-0 hover:bg-[var(--gold)]/5">
                      <td className="py-2.5 pr-3"><Link href={`/admin/sadhak/${s.id}`} className="font-semibold underline-offset-2 hover:underline">{s.name || '(बिना नाम)'}</Link><div className="text-xs tabular-nums text-[var(--maroon)]/70">+91 {s.phone}</div></td>
                      <td className="pr-3">{s.city || '—'}</td>
                      <td className="whitespace-nowrap pr-3"><PlanCell s={s} /></td>
                      <td className="pr-3"><Progress done={s.done} /></td>
                      <td className="whitespace-nowrap pr-3 tabular-nums">{s.last_done || '—'}</td>
                      <td className="pr-3 text-right tabular-nums">{rupees(s.paid_paise)}</td>
                      <td className="whitespace-nowrap tabular-nums">{s.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
      <Pager page={page} total={total} size={PAGE_SIZE} href={(p) => `/admin/sadhak?${new URLSearchParams([...query, ['page', String(p)]])}`} />
    </AdminShell>
  );
}
