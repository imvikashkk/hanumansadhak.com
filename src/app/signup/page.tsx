import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DarshanShell from '@/components/auth/DarshanShell';
import SignupForm from '@/components/auth/SignupForm';
import { SIGNUP_HERO } from '@/data/darshan';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { hasEverPaid } from '@/lib/ever-paid';
import { migrate } from '@/lib/migrate';

export const metadata: Metadata = {
  title: 'साधक बनें — Signup',
  robots: { index: false },
};

interface DraftRow { phone: string; name: string | null; age: number | null; gender: string | null; city: string | null }

export default async function SignupPage() {
  // Only their own session sees a saved draft; a guest always gets an empty form.
  const session = await getSession();
  let draft: DraftRow | undefined;
  if (session) {
    await migrate();
    if (await hasEverPaid(session.userId)) redirect('/sadhana');
    [draft] = await query<DraftRow>(`SELECT phone, name, age, gender, city FROM users WHERE id=$1`, [session.userId]);
  }

  return (
    <DarshanShell
      page="signup"
      hero={SIGNUP_HERO}
      heroAlt="राम भक्त हनुमान जी — हृदय में सिया-राम"
      heroPosition="50% 18%"
      chaupai={['जय जय जय हनुमान गोसाईं', 'कृपा करहु गुरुदेव की नाईं']}
      ribbon="40 दिन की साधना"
      ribbonIcon="flame"
      title={
        <>
          हनुमान <span className="text-ember-flow">साधक बनें</span>
        </>
      }
      sub="अपना परिचय दें, संकल्प लें — और आज से अपनी साधना शुरू करें।"
    >
      <SignupForm draft={draft} />
    </DarshanShell>
  );
}
