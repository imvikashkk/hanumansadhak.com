import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { getDayStatus, hasActiveAccess, PRODUCT } from '@/lib/sadhana';
import { getProgress } from '@/lib/sadhana-state';
import { getSubscription } from '@/lib/subscriptions';
import { isTester } from '@/lib/testers';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'कृपया पहले Login करें' }, { status: 401 });

  const { day } = await req.json().catch(() => ({}));

  await migrate();
  const sub = await getSubscription(session.userId);
  const tester = isTester(session.phone);
  if (!tester && !hasActiveAccess(sub)) {
    return NextResponse.json({ error: 'आपका प्लान सक्रिय नहीं है' }, { status: 403 });
  }

  const status = getDayStatus(await getProgress(session.userId), sub, tester, Date.now());
  if (status.completedDays.has(day)) return NextResponse.json({ success: true, alreadyDone: true });
  if (!status.canOpen(day)) {
    return NextResponse.json({ error: 'यह दिन अभी खुला नहीं है' }, { status: 403 });
  }

  await query(
    `INSERT INTO daily_progress (user_id, product, day_number) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [session.userId, PRODUCT, day]
  );
  return NextResponse.json({ success: true });
}
