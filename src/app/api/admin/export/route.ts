import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { getPaymentsForExport, getSadhaksForExport, paymentFilters, planLabel, sadhakFilters } from '@/lib/admin-data';
import { migrate } from '@/lib/migrate';

// A name like "=HYPERLINK(...)" comes from a public signup form, and spreadsheets would run it.
function cell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function csv(header: string[], rows: unknown[][]): string {
  // The BOM makes Excel read the Hindi correctly.
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await migrate();
  const params = req.nextUrl.searchParams;
  const get = (key: string) => params.get(key) ?? undefined;

  let body: string;
  let name: string;
  if (params.get('type') === 'sadhak') {
    const rows = await getSadhaksForExport(sadhakFilters(get));
    name = 'sadhak';
    body = csv(
      ['ID', 'Name', 'Phone', 'City', 'Joined', 'Plan', 'Plan expires', 'Days done', 'Last practice', 'Total paid (Rs)'],
      rows.map((r) => [r.id, r.name, r.phone, r.city, r.joined, planLabel(r.plan), r.expires, r.done, r.last_done, Number(r.paid_paise) / 100])
    );
  } else {
    const rows = await getPaymentsForExport(paymentFilters(get));
    name = 'payments';
    body = csv(
      ['Date', 'Name', 'Phone', 'Plan', 'Amount (Rs)', 'Status', 'Order ID', 'Payment ID'],
      rows.map((r) => [r.at, r.name, r.phone, planLabel(r.plan), r.amount / 100, r.status, r.razorpay_order_id, r.razorpay_payment_id])
    );
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="hanuman-sadhak-${name}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
