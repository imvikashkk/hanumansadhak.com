import { query } from './db';

// The one rule behind signup vs login: a number that has ever paid is a permanent account and
// logs in with OTP. Until then its row is only a draft, and signing up again overwrites it.
// Any one of the three is enough, so an expired plan still counts as having paid.
export function everPaidSql(users: string): string {
  return `(${users}.is_paid IS TRUE
    OR EXISTS (SELECT 1 FROM user_subscriptions s WHERE s.user_id = ${users}.id)
    OR EXISTS (SELECT 1 FROM payments p WHERE p.user_id = ${users}.id AND p.status = 'success'))`;
}

export async function hasEverPaid(userId: number): Promise<boolean> {
  const rows = await query(`SELECT 1 FROM users u WHERE u.id = $1 AND ${everPaidSql('u')}`, [userId]);
  return rows.length > 0;
}
