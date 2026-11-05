import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { isValidPlan, type PlanId } from '@/lib/sadhana';
import { grantSubscription, notifyPurchase } from '@/lib/subscriptions';

interface PaymentRow { id: number; user_id: number; status: string; plan: PlanId }

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as Record<string, string>;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
  }

  await migrate();
  const payments = await query<PaymentRow>(
    `SELECT id, user_id, status, plan FROM payments WHERE razorpay_order_id=$1`,
    [razorpay_order_id]
  );
  const payment = payments[0];
  if (!payment || payment.user_id !== session.userId) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (expected !== razorpay_signature) {
    // Never undo a payment already recorded as successful.
    await query(`UPDATE payments SET status='failed' WHERE id=$1 AND status<>'success'`, [payment.id]);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  await query(
    `UPDATE payments SET razorpay_payment_id=$1, razorpay_signature=$2, status='success' WHERE id=$3`,
    [razorpay_payment_id, razorpay_signature, payment.id]
  );
  // Always granted, even if a webhook marked this payment successful first: that webhook may be the
  // old app's, which doesn't grant the plan here. Whichever call really grants it sends the SMS.
  if (isValidPlan(payment.plan)) {
    if (await grantSubscription(session.userId, payment.plan)) await notifyPurchase(session.userId);
  } else console.error('Payment for unknown plan', payment.plan, payment.id);

  return NextResponse.json({ success: true });
}
