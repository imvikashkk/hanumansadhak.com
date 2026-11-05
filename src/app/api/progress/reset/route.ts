import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { hasActiveAccess, PLANS, PRODUCT, SADHANA_DAYS } from '@/lib/sadhana';
import { getProgress } from '@/lib/sadhana-state';
import { getSubscription } from '@/lib/subscriptions';
import { isTester } from '@/lib/testers';

// Lifetime plan only: start the 40 days over once they are finished.
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'कृपया पहले Login करें' }, { status: 401 });

  await migrate();
  const sub = await getSubscription(session.userId);
  const allowed = isTester(session.phone) || (hasActiveAccess(sub) && !!sub && PLANS[sub.plan]?.canRestart);
  if (!allowed) return NextResponse.json({ error: 'यह सुविधा सिर्फ Lifetime प्लान में है' }, { status: 403 });

  if ((await getProgress(session.userId)).length < SADHANA_DAYS) {
    return NextResponse.json({ error: 'साधना पूरी होने के बाद ही दोबारा शुरू कर सकते हैं' }, { status: 403 });
  }

  await query(`DELETE FROM daily_progress WHERE user_id=$1 AND product=$2`, [session.userId, PRODUCT]);
  return NextResponse.json({ success: true });
}
