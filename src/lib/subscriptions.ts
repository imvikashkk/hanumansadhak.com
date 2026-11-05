import { query } from './db';
import { PLANS, PRODUCT, planRankSqlCase, type PlanId, type Subscription } from './sadhana';
import { sendPurchaseSms } from './sms';

export async function getSubscription(userId: number): Promise<Subscription | null> {
  const rows = await query<Subscription>(
    `SELECT plan, expires_at FROM user_subscriptions WHERE user_id=$1 AND product=$2`,
    [userId, PRODUCT]
  );
  return rows[0] ?? null;
}

// Grants `plan` after a successful payment. Never downgrades: if the user already
// upgraded via another order in the meantime, the higher plan is kept. The last
// clause allows renewing the same plan once it has already expired.
export async function grantSubscription(userId: number, plan: PlanId) {
  const durationDays = PLANS[plan]?.durationDays ?? null;
  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 86400000) : null;

  await query(
    `INSERT INTO user_subscriptions (user_id, product, plan, expires_at) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, product) DO UPDATE
       SET plan=EXCLUDED.plan, expires_at=EXCLUDED.expires_at, updated_at=NOW()
     WHERE ${planRankSqlCase('user_subscriptions.plan')} < ${planRankSqlCase('EXCLUDED.plan')}
        OR (user_subscriptions.plan = EXCLUDED.plan
            AND user_subscriptions.expires_at IS NOT NULL
            AND user_subscriptions.expires_at < NOW())`,
    [userId, PRODUCT, plan, expiresAt]
  );
  // "Has ever paid" flag — signup uses it to send paid users to OTP login instead.
  await query(`UPDATE users SET is_paid=TRUE WHERE id=$1`, [userId]);
}

// Confirmation SMS after a purchase. A failed SMS is only logged — the payment already went through.
export async function notifyPurchase(userId: number) {
  const users = await query<{ phone: string }>(`SELECT phone FROM users WHERE id=$1`, [userId]);
  if (users[0]) await sendPurchaseSms(users[0].phone);
}
