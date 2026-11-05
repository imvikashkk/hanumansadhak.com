import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DarshanShell from '@/components/auth/DarshanShell';
import PaymentPanel from '@/components/auth/PaymentPanel';
import { PAYMENT_HERO } from '@/data/darshan';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { canPurchase, DEFAULT_PLAN, getDayStatus, hasActiveAccess, PLAN_ORDER, PLANS, purchasePricePaise, SADHANA_DAYS } from '@/lib/sadhana';
import { getProgress } from '@/lib/sadhana-state';
import { getSubscription } from '@/lib/subscriptions';

export const metadata: Metadata = {
  title: 'अपना प्लान चुनें',
  robots: { index: false },
};

interface UserRow { name: string | null; phone: string }

export default async function PaymentPage() {
  const session = await getSession();
  if (!session) redirect('/signup');

  await migrate();
  const users = await query<UserRow>(`SELECT name, phone FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) redirect('/signup');
  const user = users[0];
  const sub = await getSubscription(session.userId);

  const planOver = !!sub && !hasActiveAccess(sub);
  // Only counts and the next day are read from this, which don't depend on the time.
  const status = getDayStatus(await getProgress(session.userId), sub, false, 0);

  const available = PLAN_ORDER.filter((p) => canPurchase(p, sub));
  const plans = available.map((id) => ({ ...PLANS[id], pricePaise: purchasePricePaise(id, sub), fullPricePaise: PLANS[id].pricePaise }));

  return (
    <DarshanShell
      page="payment"
      hero={PAYMENT_HERO}
      heroAlt="पंचमुखी हनुमान जी"
      heroPosition="50% 12%"
      chaupai={['संकट कटै मिटै सब पीरा', 'जो सुमिरै हनुमत बलबीरा']}
      ribbon="अंतिम चरण"
      ribbonIcon="lock"
      title={
        <>
          {user.name ? `${user.name} जी, ` : ''}
          <span className="text-ember-flow">जय श्री राम</span>
        </>
      }
      sub={available.length ? 'अपना प्लान चुनें और आज से साधना शुरू करें।' : 'आपकी साधना सक्रिय है।'}
    >
      {planOver && !status.fullyComplete && (
        <div className="mb-3 rounded-2xl border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-4 py-3 text-center text-[#fff1cf]">
          <p className="font-display text-xl text-[var(--gold)]">आपका प्लान समाप्त हो गया है</p>
          <p className="mt-1 text-sm leading-snug">
            आपने {status.totalCompleted} / {SADHANA_DAYS} दिन पूरे किए हैं और आपकी प्रगति सुरक्षित है। प्लान लेकर{status.nextDay ? ` दिन ${status.nextDay} से` : ''} आगे बढ़ें और साधना पूरी करके प्रमाणपत्र पाएं।
          </p>
        </div>
      )}
      <PaymentPanel
        user={user}
        plans={plans}
        defaultPlan={available.includes(DEFAULT_PLAN) ? DEFAULT_PLAN : available[0]}
        currentPlanLabel={sub ? PLANS[sub.plan]?.label : undefined}
      />
      {planOver && status.fullyComplete && (
        <Link href="/sadhana/certificate" className="mt-3 block text-center text-base font-bold text-[var(--gold)] underline underline-offset-4">
          अपना प्रमाणपत्र देखें
        </Link>
      )}
      {available.length > 0 && hasActiveAccess(sub) && (
        <Link href="/sadhana" className="mt-3 block text-center text-base font-bold text-[var(--gold)] underline underline-offset-4">
          ← अपनी साधना पर वापस जाएं
        </Link>
      )}
    </DarshanShell>
  );
}
