import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DarshanShell from '@/components/auth/DarshanShell';
import LoginForm from '@/components/auth/LoginForm';
import { LOGIN_HERO } from '@/data/darshan';
import { getSession } from '@/lib/auth';
import { hasEverPaid } from '@/lib/ever-paid';
import { migrate } from '@/lib/migrate';
import { safeNext } from '@/lib/safe-next';
import { isTester } from '@/lib/testers';

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  // Already in with a paid account: nothing to do here. A never-paid session stays on this page,
  // since they may be here to log in to a different number that has paid.
  const session = await getSession();
  if (session) {
    await migrate();
    if (isTester(session.phone) || (await hasEverPaid(session.userId))) redirect(safeNext(next) ?? '/sadhana');
  }

  return (
    <DarshanShell
      page="login"
      hero={LOGIN_HERO}
      heroAlt="श्री हनुमान जी — पीछे सूर्यास्त और पर्वत"
      heroPosition="74% 30%"
      chaupai={['राम काज कीन्हे बिनु', 'मोहि कहाँ बिश्राम']}
      ribbon="साधक Login"
      ribbonIcon="lock"
      title={
        <>
          फिर से <span className="text-ember-flow">स्वागत है</span>
        </>
      }
      sub="अपना रजिस्टर किया हुआ मोबाइल नंबर डालें — OTP से Login करें।"
    >
      <LoginForm next={safeNext(next) ?? undefined} />
    </DarshanShell>
  );
}
