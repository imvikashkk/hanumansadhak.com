import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { getRazorpay } from '@/lib/razorpay';
import { canPurchase, isValidPlan, PRODUCT, purchasePricePaise } from '@/lib/sadhana';
import { getSubscription } from '@/lib/subscriptions';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'कृपया पहले Signup या Login करें' }, { status: 401 });

  const { planId } = await req.json().catch(() => ({}));
  if (!isValidPlan(planId)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  await migrate();
  const sub = await getSubscription(session.userId);
  if (!canPurchase(planId, sub)) {
    return NextResponse.json({ error: 'यह प्लान आपके लिए उपलब्ध नहीं है' }, { status: 409 });
  }
  const amount = purchasePricePaise(planId, sub);

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt: `hk_${session.userId}_${Date.now()}`,
      notes: { userId: String(session.userId), phone: session.phone, plan: planId, product: PRODUCT },
    });

    await query(
      `INSERT INTO payments (user_id, razorpay_order_id, amount, status, plan, product) VALUES ($1, $2, $3, 'pending', $4, $5)`,
      [session.userId, order.id, amount, planId, PRODUCT]
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'ऑर्डर बनाने में समस्या हुई' }, { status: 500 });
  }
}
