import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminShell, { PageTitle, Panel, rupees } from '@/components/admin/AdminShell';
import PaymentList from '@/components/admin/PaymentList';
import Icon from '@/components/Icon';
import { GENDERS } from '@/data/signup';
import { requireAdmin } from '@/lib/admin-auth';
import { getSadhak, planLabel } from '@/lib/admin-data';
import { migrate } from '@/lib/migrate';
import { SADHANA_DAYS } from '@/lib/sadhana';

export const metadata: Metadata = { title: 'Admin — साधक', robots: { index: false, follow: false } };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-[var(--maroon)]/10 py-2 first:border-0">
      <dt className="shrink-0 text-sm text-[var(--maroon)]/70">{label}</dt>
      <dd className="min-w-0 break-words text-right text-sm font-semibold">{children}</dd>
    </div>
  );
}

export default async function AdminSadhakDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  await migrate();
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();
  const data = await getSadhak(Number(id));
  if (!data) notFound();
  const { user, payments, days } = data;
  const doneAt = new Map(days.map((d) => [d.day_number, d.at]));

  return (
    <AdminShell active="sadhak">
      <Link href="/admin/sadhak" className="mb-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold"><Icon name="chevronLeft" /> सभी साधक</Link>
      <PageTitle
        title={user.name || '(बिना नाम)'}
        sub={<span className="tabular-nums">+91 {user.phone}</span>}
        action={
          <a href={`https://wa.me/91${user.phone}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-1.5 rounded-lg bg-[#128c4a] px-3 text-sm font-bold text-white">
            <Icon name="whatsapp" /> WhatsApp
          </a>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="जानकारी">
          <dl>
            <Row label="शहर">{user.city || '—'}</Row>
            <Row label="उम्र / लिंग">{[user.age, GENDERS.find((g) => g.id === user.gender)?.label ?? user.gender].filter(Boolean).join(' / ') || '—'}</Row>
            <Row label="जुड़े">{user.joined}</Row>
            <Row label="कहाँ से">{user.signup_source || 'पुरानी site'}</Row>
          </dl>
        </Panel>
        <Panel title="प्लान">
          <dl>
            <Row label="प्लान">{user.plan ? planLabel(user.plan) : user.ever_paid ? 'कोई प्लान नहीं' : 'बिना भुगतान'}</Row>
            <Row label="वैधता">{!user.plan ? '—' : user.expired ? <span className="text-red-700">समाप्त: {user.expires}</span> : user.expires ? `${user.expires} तक` : 'कोई समय सीमा नहीं'}</Row>
            <Row label="कुल भुगतान">{rupees(user.paid_paise)}</Row>
            <Row label="प्रमाणपत्र">
              {user.sadhak_code ? <Link href={`/sadhak/${user.sadhak_code}`} target="_blank" className="underline underline-offset-2">{user.sadhak_code}</Link> : user.done >= SADHANA_DAYS ? 'पूरी की, अभी खोला नहीं' : 'अभी नहीं'}
            </Row>
          </dl>
        </Panel>
      </div>

      <Panel title={`साधना: ${Math.min(user.done, SADHANA_DAYS)} / ${SADHANA_DAYS} दिन`} className="mt-4" action={<span className="text-sm text-[var(--maroon)]/75">आखिरी: {user.last_done || '—'}</span>}>
        <ul className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {Array.from({ length: SADHANA_DAYS }, (_, i) => i + 1).map((day) => {
            const at = doneAt.get(day);
            return (
              <li key={day} title={at ? `दिन ${day}: ${at}` : `दिन ${day}: बाकी`} className={`grid aspect-square place-items-center rounded text-[11px] font-semibold tabular-nums sm:text-xs ${at ? 'bg-[var(--sindoor)] text-white' : 'bg-[var(--maroon)]/8 text-[var(--maroon)]/60'}`}>
                {day}
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title={`Payments (${payments.length})`} className="mt-4"><PaymentList rows={payments} linkName={false} /></Panel>
    </AdminShell>
  );
}
