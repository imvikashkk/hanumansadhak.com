import Link from 'next/link';
import type { PaymentRow } from '@/lib/admin-data';
import { planLabel } from '@/lib/admin-data';
import { rupees, StatusBadge } from './AdminShell';

// A table from md up; on phones each payment is a card, so nothing has to scroll sideways.
export default function PaymentList({ rows, linkName = true }: { rows: PaymentRow[]; linkName?: boolean }) {
  if (!rows.length) return <p className="py-8 text-center text-[var(--maroon)]/70">कोई payment नहीं मिला</p>;
  const who = (p: PaymentRow) =>
    linkName ? <Link href={`/admin/sadhak/${p.user_id}`} className="font-semibold underline-offset-2 hover:underline">{p.name || '(बिना नाम)'}</Link> : <span className="font-semibold">{p.name || '(बिना नाम)'}</span>;
  return (
    <>
      <ul className="divide-y divide-[var(--maroon)]/10 md:hidden">
        {rows.map((p) => (
          <li key={p.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">{who(p)}<p className="text-sm tabular-nums text-[var(--maroon)]/75">+91 {p.phone}</p></div>
              <p className="shrink-0 font-display text-xl tabular-nums">{rupees(p.amount)}</p>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--maroon)]/75">
              <StatusBadge status={p.status} /><span>{planLabel(p.plan)}</span><span>{p.at}</span>
            </div>
            <p className="mt-1 break-all font-mono text-[11px] text-[var(--maroon)]/60">{p.razorpay_payment_id || p.razorpay_order_id}</p>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--maroon)]/15 text-xs text-[var(--maroon)]/70">
              <th className="py-2 pr-3 font-semibold">तारीख</th><th className="pr-3 font-semibold">साधक</th><th className="pr-3 font-semibold">प्लान</th>
              <th className="pr-3 text-right font-semibold">राशि</th><th className="pr-3 font-semibold">स्थिति</th><th className="font-semibold">Razorpay ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-[var(--maroon)]/8 last:border-0 hover:bg-[var(--gold)]/5">
                <td className="whitespace-nowrap py-2.5 pr-3 tabular-nums">{p.at}</td>
                <td className="pr-3">{who(p)}<div className="text-xs tabular-nums text-[var(--maroon)]/70">+91 {p.phone}</div></td>
                <td className="whitespace-nowrap pr-3">{planLabel(p.plan)}</td>
                <td className="pr-3 text-right font-semibold tabular-nums">{rupees(p.amount)}</td>
                <td className="pr-3"><StatusBadge status={p.status} /></td>
                <td className="font-mono text-[11px] text-[var(--maroon)]/65">{p.razorpay_payment_id || p.razorpay_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
