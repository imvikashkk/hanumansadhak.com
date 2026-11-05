import { redirect } from 'next/navigation';
import { getSession } from './auth';
import { query } from './db';
import { migrate } from './migrate';
import { getDayStatus, hasActiveAccess, PRODUCT, type DayProgress, type Subscription } from './sadhana';
import { getSubscription } from './subscriptions';
import { isTester } from './testers';

export interface SadhakUser {
  id: number;
  phone: string;
  name: string | null;
  created_at: string | Date;
}

export async function getProgress(userId: number) {
  return query<DayProgress>(
    `SELECT day_number, completed_at FROM daily_progress WHERE user_id=$1 AND product=$2 ORDER BY day_number`,
    [userId, PRODUCT]
  );
}

export interface SadhanaState {
  user: SadhakUser;
  sub: Subscription | null;
  tester: boolean;
  progress: DayProgress[];
  status: ReturnType<typeof getDayStatus>;
  now: number;
}

// Everything a logged-in sadhana page needs, for anyone who has ever had a plan. Logged-out users
// go to login (coming back to `from`), and those who never had a plan to the payment page.
export async function loadSadhana(from: string): Promise<SadhanaState> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(from)}`);

  await migrate();
  const users = await query<SadhakUser>(`SELECT id, phone, name, created_at FROM users WHERE id=$1`, [session.userId]);
  const user = users[0];
  if (!user) redirect('/signup');

  const sub = await getSubscription(user.id);
  const tester = isTester(user.phone);
  if (!tester && !sub) redirect('/payment');

  const progress = await getProgress(user.id);
  const now = Date.now();
  return { user, sub, tester, progress, status: getDayStatus(progress, sub, tester, now), now };
}

export function planExpired(state: Pick<SadhanaState, 'sub' | 'tester'>): boolean {
  return !state.tester && !hasActiveAccess(state.sub);
}

// For the practice itself, which needs an active plan. When the plan is over: finished the 40 days
// → their certificate, which is theirs to keep; not finished → a new plan, to carry on where they stopped.
export async function requireSadhana(from: string): Promise<SadhanaState> {
  const state = await loadSadhana(from);
  if (planExpired(state)) redirect(state.status.fullyComplete ? '/sadhana/certificate' : '/payment');
  return state;
}
