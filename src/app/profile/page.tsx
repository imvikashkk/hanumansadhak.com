import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Icon, { type IconName } from '@/components/Icon';
import AppShell, { GoldCard } from '@/components/sadhana/AppShell';
import LogoutButton from '@/components/sadhana/LogoutButton';
import NameEditor from '@/components/sadhana/NameEditor';
import TextSizeControl from '@/components/sadhana/TextSizeControl';
import { HELP_TEXT } from '@/components/sadhana/tabs';
import { SITE, whatsappLink } from '@/data/site';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { getDayStatus, hasActiveAccess, PLANS, SADHANA_DAYS } from '@/lib/sadhana';
import { getProgress, type SadhakUser } from '@/lib/sadhana-state';
import { getSubscription } from '@/lib/subscriptions';
import { isTester } from '@/lib/testers';

export const metadata: Metadata = {
  title: 'प्रोफ़ाइल',
  robots: { index: false },
};

function SectionTitle({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-2xl">
      <Icon name={icon} className="text-[var(--sindoor)]" /> {children}
    </h2>
  );
}

// Unlike the sadhana pages this stays open without a plan, so an expired user can still log out.
export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/profile');

  await migrate();
  const users = await query<SadhakUser>(`SELECT id, phone, name, created_at FROM users WHERE id=$1`, [session.userId]);
  const user = users[0];
  if (!user) redirect('/signup');

  const sub = await getSubscription(user.id);
  const tester = isTester(user.phone);
  // Only counts are read from this, which don't depend on the time.
  const status = getDayStatus(await getProgress(user.id), sub, tester, 0);
  const done = Math.min(status.totalCompleted, SADHANA_DAYS);
  const memberSince = new Date(user.created_at).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const planLabel = tester ? 'Tester' : sub ? (PLANS[sub.plan]?.label ?? sub.plan) : 'कोई प्लान नहीं';

  const stats: { icon: IconName; value: string | number; label: string }[] = [
    { icon: 'calendar', value: done, label: 'दिन पूरे' },
    { icon: 'flame', value: SADHANA_DAYS - done, label: 'दिन बाकी' },
    { icon: 'certificate', value: status.fullyComplete ? 1 : 0, label: 'प्रमाणपत्र' },
  ];

  return (
    <AppShell expired={!tester && sub && !hasActiveAccess(sub) ? (status.fullyComplete ? 'finished' : 'unfinished') : undefined}>
      <div className="text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#fbe7a1] to-[#b8781c] font-display text-5xl text-[var(--maroon)] shadow-[0_0_30px_-8px_var(--gold)]">
          {user.name?.[0] ?? <Icon name="user" />}
        </span>
        <h1 className="mt-3 break-words font-display text-4xl leading-tight">{user.name || 'साधक'}</h1>
        <p className="mt-1 font-semibold">+91 {user.phone}</p>
        <p className="text-sm text-[var(--maroon)]/70">{memberSince} से साधक</p>
      </div>

      <div className="mt-6 space-y-5">
        <ul className="grid grid-cols-3 gap-2.5">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-[var(--gold)]/40 bg-white/70 px-1 py-3 text-center">
              <Icon name={s.icon} className="text-xl text-[var(--sindoor)]" />
              <p className="font-display text-3xl leading-tight">{s.value}</p>
              <p className="text-sm text-[var(--maroon)]/75">{s.label}</p>
            </li>
          ))}
        </ul>

        <GoldCard>
          <SectionTitle icon="lotus">मेरी साधना</SectionTitle>
          <p className="mt-2">प्लान: <strong>{planLabel}</strong></p>
          {!tester && sub && !hasActiveAccess(sub) && <p className="mt-1 font-semibold text-red-700">आपका प्लान समाप्त हो गया है</p>}
          <Link
            href={tester || hasActiveAccess(sub) ? '/sadhana' : '/payment'}
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[var(--sindoor)] font-bold text-[var(--sindoor)]"
          >
            {tester || hasActiveAccess(sub) ? 'साधना खोलें' : sub ? 'प्लान नवीनीकरण करें' : 'प्लान चुनें'} <Icon name="arrowRight" />
          </Link>
          {status.fullyComplete && (
            <Link href="/sadhana/certificate" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ember font-bold text-[var(--primary-foreground)]">
              <Icon name="certificate" /> प्रमाणपत्र देखें / डाउनलोड करें
            </Link>
          )}
        </GoldCard>

        <GoldCard>
          <SectionTitle icon="user">मेरा नाम</SectionTitle>
          <p className="mb-3 mt-1 text-sm text-[var(--maroon)]/70">प्रमाणपत्र पर यही नाम छपेगा</p>
          <NameEditor name={user.name} />
        </GoldCard>

        <GoldCard>
          <SectionTitle icon="book">अक्षर का आकार</SectionTitle>
          <p className="mb-3 mt-1 text-sm text-[var(--maroon)]/70">पढ़ने में आसानी हो, वैसा चुनें</p>
          <TextSizeControl />
        </GoldCard>

        <GoldCard>
          <SectionTitle icon="whatsapp">मदद</SectionTitle>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <a href={whatsappLink(HELP_TEXT)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25d366] font-bold text-white">
              <Icon name="whatsapp" /> WhatsApp करें
            </a>
            <a href={`mailto:${SITE.email}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[var(--maroon)]/25 font-bold">
              <Icon name="mail" /> ईमेल करें
            </a>
          </div>
          <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
            <Link href="/privacy-policy" className="underline underline-offset-4">Privacy</Link>
            <Link href="/terms" className="underline underline-offset-4">Terms</Link>
            <Link href="/refund-policy" className="underline underline-offset-4">Refund</Link>
          </p>
        </GoldCard>

        <LogoutButton />
      </div>
    </AppShell>
  );
}
