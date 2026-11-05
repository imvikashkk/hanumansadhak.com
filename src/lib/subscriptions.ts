import { query } from './db';
import { isValidPlan, PLANS, PRODUCT, planRankSqlCase, type PlanId, type Subscription } from './sadhana';
import { sendPurchaseSms } from './sms';

// The old app shares this database and its webhook can record a payment as successful without
// granting the plan here. A sadhak must never have paid and be asked to pay again, so a successful
// payment newer than their subscription is granted the moment anything looks them up.
async function grantUnappliedPayment(userId: number) {
  const rows = await query<{ plan: string }>(
    `SELECT p.plan FROM payments p
     LEFT JOIN user_subscriptions s ON s.user_id = p.user_id AND s.product = p.product
     WHERE p.user_id = $1 AND p.product = $2 AND p.status = 'success' AND (s.id IS NULL OR p.created_at > s.updated_at)
     ORDER BY ${planRankSqlCase('p.plan')} DESC, p.created_at DESC LIMIT 1`,
    [userId, PRODUCT]
  );
  const plan = rows[0]?.plan;
  if (isValidPlan(plan) && (await grantSubscription(userId, plan))) await notifyPurchase(userId);
}

export async function getSubscription(userId: number): Promise<Subscription | null> {
  await grantUnappliedPayment(userId);
  const rows = await query<Subscription>(
    `SELECT plan, expires_at FROM user_subscriptions WHERE user_id=$1 AND product=$2`,
    [userId, PRODUCT]
  );
  return rows[0] ?? null;
}

// Grants `plan` after a successful payment. Never downgrades: if the user already
// upgraded via another order in the meantime, the higher plan is kept. The last
// clause allows renewing the same plan once it has already expired. Safe to call repeatedly: it
// returns whether anything changed, which is what decides that a purchase SMS is due.
export async function grantSubscription(userId: number, plan: PlanId): Promise<boolean> {
  const durationDays = PLANS[plan]?.durationDays ?? null;
  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 86400000) : null;

  const granted = await query(
    `INSERT INTO user_subscriptions (user_id, product, plan, expires_at) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, product) DO UPDATE
       SET plan=EXCLUDED.plan, expires_at=EXCLUDED.expires_at, updated_at=NOW()
     WHERE ${planRankSqlCase('user_subscriptions.plan')} < ${planRankSqlCase('EXCLUDED.plan')}
        OR (user_subscriptions.plan = EXCLUDED.plan
            AND user_subscriptions.expires_at IS NOT NULL
            AND user_subscriptions.expires_at < NOW())
     RETURNING id`,
    [userId, PRODUCT, plan, expiresAt]
  );
  // "Has ever paid" flag — signup uses it to send paid users to OTP login instead.
  await query(`UPDATE users SET is_paid=TRUE WHERE id=$1`, [userId]);
  return granted.length > 0;
}

// Confirmation SMS after a purchase. A failed SMS is only logged — the payment already went through.
export async function notifyPurchase(userId: number) {
  const users = await query<{ phone: string }>(`SELECT phone FROM users WHERE id=$1`, [userId]);
  if (users[0]) await sendPurchaseSms(users[0].phone);
}
