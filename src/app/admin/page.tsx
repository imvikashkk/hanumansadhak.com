import type { Metadata } from 'next';
import Link from 'next/link';
import AdminShell, { PageTitle, Panel, rupees, Stat } from '@/components/admin/AdminShell';
import PaymentList from '@/components/admin/PaymentList';
import RevenueChart from '@/components/admin/RevenueChart';
import { requireAdmin } from '@/lib/admin-auth';
import { getOverview, planLabel } from '@/lib/admin-data';
import { migrate } from '@/lib/migrate';

export const metadata: Metadata = { title: 'Admin — Overview', robots: { index: false, follow: false } };

export default async function AdminOverview() {
  await requireAdmin();
  await migrate();
  const { revenue, people, plans, practice, daily, byPlan, recent } = await getOverview();
  const fortnight = daily.reduce((n, d) => n + Number(d.paise), 0);
  const seeAll = 'text-sm font-semibold text-[var(--sindoor)] underline underline-offset-2';

  return (
    <AdminShell active="overview">
      <PageTitle title="Overview" sub="सभी समय भारतीय समय (IST) में" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat strong label="आज की कमाई" value={rupees(revenue.today)} note={`${revenue.sales_today} बिक्री`} />
        <Stat label="पिछले 7 दिन" value={rupees(revenue.week)} />
        <Stat label="पिछले 30 दिन" value={rupees(revenue.month)} />
        <Stat label="कुल कमाई" value={rupees(revenue.total)} note={`${revenue.sales} बिक्री`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="रोज़ की कमाई" action={<span className="text-sm tabular-nums text-[var(--maroon)]/75">14 दिन: {rupees(fortnight)}</span>}>
          <RevenueChart days={daily} />
        </Panel>
        <Panel title="प्लान के हिसाब से">
          {byPlan.length ? (
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs text-[var(--maroon)]/70"><th className="py-1 font-semibold">प्लान</th><th className="text-right font-semibold">चालू</th><th className="text-right font-semibold">बिक्री</th><th className="text-right font-semibold">कमाई</th></tr></thead>
              <tbody>
                {byPlan.map((p) => (
                  <tr key={p.plan} className="border-t border-[var(--maroon)]/10 tabular-nums">
                    <td className="py-2 font-semibold">{planLabel(p.plan)}</td><td className="text-right">{p.active}</td><td className="text-right">{p.sales}</td><td className="text-right">{rupees(p.paise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="py-6 text-center text-[var(--maroon)]/70">अभी कोई प्लान नहीं</p>}
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="भुगतान किए हुए साधक" value={people.paid} note={`बिना भुगतान: ${people.drafts}`} />
        <Stat label="चालू प्लान" value={plans.active} note={`30 दिन में समाप्त: ${plans.expiring} · समाप्त: ${plans.expired}`} />
        <Stat label="इस हफ़्ते साधना की" value={practice.active_week} note={`कभी शुरू की: ${practice.started}`} />
        <Stat label="40 दिन पूरे" value={practice.finished} note={`आज नए signup: ${people.new_today}`} />
      </div>

      <Panel title="हाल की बिक्री" className="mt-4" action={<Link href="/admin/payments" className={seeAll}>सभी देखें</Link>}>
        <PaymentList rows={recent} />
      </Panel>
    </AdminShell>
  );
}
