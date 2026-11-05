import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { isValidPlan, PRODUCT, type PlanId } from '@/lib/sadhana';
import { grantSubscription, notifyPurchase } from '@/lib/subscriptions';

// Razorpay webhook — backup for when the browser closes before /api/payment/verify runs.
// Razorpay dashboard > Webhooks: https://<domain>/api/payment/webhook, events payment.captured + payment.failed.

interface PaymentRow { id: number; user_id: number; status: string; plan: PlanId; product: string }

interface RazorpayWebhookBody {
  event: string;
  payload: { payment: { entity: { id: string; order_id: string } } };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (expected !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const body = JSON.parse(rawBody) as RazorpayWebhookBody;
  if (body.event !== 'payment.captured' && body.event !== 'payment.failed') {
    return NextResponse.json({ success: true });
  }

  await migrate();
  const { id: paymentId, order_id: orderId } = body.payload.payment.entity;
  const payments = await query<PaymentRow>(
    `SELECT id, user_id, status, plan, product FROM payments WHERE razorpay_order_id=$1`,
    [orderId]
  );
  const payment = payments[0];
  // Orders of other products (old app, same database) are that app's webhook's job.
  if (!payment || payment.product !== PRODUCT) return NextResponse.json({ success: true });

  if (body.event === 'payment.failed') {
    // Only downgrade a still-pending order — a later retry on the same order may have succeeded.
    if (payment.status === 'pending') await query(`UPDATE payments SET status='failed' WHERE id=$1`, [payment.id]);
    return NextResponse.json({ success: true });
  }

  if (payment.status !== 'success') {
    await query(`UPDATE payments SET razorpay_payment_id=$1, status='success' WHERE id=$2`, [paymentId, payment.id]);
  }
  // Always granted (see /api/payment/verify). Whichever call really grants it sends the SMS.
  if (isValidPlan(payment.plan)) {
    if (await grantSubscription(payment.user_id, payment.plan)) await notifyPurchase(payment.user_id);
  } else console.error('Payment for unknown plan', payment.plan, payment.id);

  return NextResponse.json({ success: true });
}
