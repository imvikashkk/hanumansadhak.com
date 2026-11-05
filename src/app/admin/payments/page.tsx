import type { Metadata } from 'next';
import Link from 'next/link';
import AdminShell, { exportClass, fieldClass, PageTitle, Pager, Panel, rupees, Stat } from '@/components/admin/AdminShell';
import PaymentList from '@/components/admin/PaymentList';
import Icon from '@/components/Icon';
import { requireAdmin } from '@/lib/admin-auth';
import { getPayments, PAGE_SIZE, paymentFilters, planLabel } from '@/lib/admin-data';
import { migrate } from '@/lib/migrate';
import { PLANS } from '@/lib/sadhana';

export const metadata: Metadata = { title: 'Admin — Payments', robots: { index: false, follow: false } };

type Search = Record<string, string | string[] | undefined>;
const label = 'mb-1 block text-xs font-semibold text-[var(--maroon)]/75';

export default async function AdminPayments({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  await migrate();
  const search = await searchParams;
  const get = (key: string) => (typeof search[key] === 'string' ? (search[key] as string) : undefined);
  const f = paymentFilters(get);
  const page = Math.max(1, Math.floor(Number(get('page'))) || 1);
  const { rows, summary, total } = await getPayments(f, page);

  const query = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);
  const of = (status: string) => summary.find((s) => s.status === status);
  const filtered = query.size > 0;

  return (
    <AdminShell active="payments">
      <PageTitle
        title="Payments"
        sub={`${total} payments${filtered ? ' (फ़िल्टर लगा है)' : ''}`}
        action={<a href={`/api/admin/export?type=payments&${query}`} className={exportClass}><Icon name="download" /> CSV</a>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat strong label="कमाई" value={rupees(of('success')?.paise ?? 0)} />
        <Stat label="सफल" value={of('success')?.count ?? 0} />
        <Stat label="पेंडिंग" value={of('pending')?.count ?? 0} note="ज़्यादातर अधूरा checkout" />
        <Stat label="असफल" value={of('failed')?.count ?? 0} />
      </div>

      <form className="mt-4 grid grid-cols-2 items-end gap-3 rounded-2xl border border-[var(--maroon)]/12 bg-white/75 p-4 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto]">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="q" className={label}>खोजें</label>
          <input id="q" name="q" defaultValue={f.q} placeholder="नाम, नंबर या Razorpay ID" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="status" className={label}>स्थिति</label>
          <select id="status" name="status" defaultValue={f.status} className={fieldClass}>
            <option value="">सभी</option><option value="success">सफल</option><option value="pending">पेंडिंग</option><option value="failed">असफल</option>
          </select>
        </div>
        <div>
          <label htmlFor="plan" className={label}>प्लान</label>
          <select id="plan" name="plan" defaultValue={f.plan} className={fieldClass}>
            <option value="">सभी</option>
            {Object.keys(PLANS).map((id) => <option key={id} value={id}>{planLabel(id)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="from" className={label}>से</label>
          <input id="from" name="from" type="date" defaultValue={f.from} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="to" className={label}>तक</label>
          <input id="to" name="to" type="date" defaultValue={f.to} className={fieldClass} />
        </div>
        <div className="col-span-2 flex items-center gap-3 md:col-span-1">
          <button type="submit" className="h-10 flex-1 rounded-lg bg-ember px-4 text-sm font-bold text-[var(--primary-foreground)]">लागू करें</button>
          {filtered && <Link href="/admin/payments" className="text-sm font-semibold underline underline-offset-2">हटाएं</Link>}
        </div>
      </form>

      <Panel className="mt-4"><PaymentList rows={rows} /></Panel>
      <Pager page={page} total={total} size={PAGE_SIZE} href={(p) => `/admin/payments?${new URLSearchParams([...query, ['page', String(p)]])}`} />
    </AdminShell>
  );
}
