// Everything the admin panel reads. Read-only: nothing here changes data.
// Timestamps are stored as UTC wall-clock time; dates are shown and filtered in IST.
import { query } from './db';
import { everPaidSql } from './ever-paid';
import { PLANS, PRODUCT, SADHANA_DAYS, type PlanId } from './sadhana';

export const PAGE_SIZE = 50;

const ist = (col: string) => `(${col} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')`;
const TODAY = `(NOW() AT TIME ZONE 'Asia/Kolkata')::date`;
const shown = (col: string) => `to_char(${ist(col)}, 'DD Mon YYYY, HH12:MI AM')`;
const shownDate = (col: string) => `to_char(${ist(col)}, 'DD Mon YYYY')`;

// A search typed by the admin must not act as a LIKE pattern.
const like = (s: string) => `%${s.replace(/[\\%_]/g, '\\$&')}%`;

export function planLabel(plan: string | null): string {
  return plan ? (PLANS[plan as PlanId]?.label ?? plan) : '—';
}

/* ───────────── overview ───────────── */

export async function getOverview() {
  const [revenue] = await query<{ total: string; today: string; week: string; month: string; sales: number; sales_today: number }>(
    `SELECT COALESCE(SUM(amount), 0)::text AS total,
            COALESCE(SUM(amount) FILTER (WHERE ${ist('created_at')}::date = ${TODAY}), 0)::text AS today,
            COALESCE(SUM(amount) FILTER (WHERE ${ist('created_at')}::date > ${TODAY} - 7), 0)::text AS week,
            COALESCE(SUM(amount) FILTER (WHERE ${ist('created_at')}::date > ${TODAY} - 30), 0)::text AS month,
            COUNT(*)::int AS sales,
            COUNT(*) FILTER (WHERE ${ist('created_at')}::date = ${TODAY})::int AS sales_today
     FROM payments WHERE status = 'success'`
  );
  const [people] = await query<{ total: number; paid: number; drafts: number; new_today: number }>(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE ${everPaidSql('u')})::int AS paid,
            COUNT(*) FILTER (WHERE NOT ${everPaidSql('u')})::int AS drafts,
            COUNT(*) FILTER (WHERE ${ist('u.created_at')}::date = ${TODAY})::int AS new_today
     FROM users u`
  );
  const [plans] = await query<{ active: number; expired: number; expiring: number }>(
    `SELECT COUNT(*) FILTER (WHERE expires_at IS NULL OR expires_at > NOW())::int AS active,
            COUNT(*) FILTER (WHERE expires_at <= NOW())::int AS expired,
            COUNT(*) FILTER (WHERE expires_at > NOW() AND expires_at <= NOW() + interval '30 days')::int AS expiring
     FROM user_subscriptions WHERE product = $1`,
    [PRODUCT]
  );
  const [practice] = await query<{ started: number; active_week: number; finished: number }>(
    `SELECT COUNT(*)::int AS started,
            COUNT(*) FILTER (WHERE last_done > NOW() - interval '7 days')::int AS active_week,
            COUNT(*) FILTER (WHERE done >= ${SADHANA_DAYS})::int AS finished
     FROM (SELECT COUNT(*) AS done, MAX(completed_at) AS last_done FROM daily_progress WHERE product = $1 GROUP BY user_id) d`,
    [PRODUCT]
  );
  const daily = await query<{ label: string; full: string; paise: string; sales: number }>(
    `SELECT to_char(day, 'DD') AS label, to_char(day, 'DD Mon') AS full,
            COALESCE(SUM(p.amount), 0)::text AS paise, COUNT(p.id)::int AS sales
     FROM generate_series(${TODAY} - 13, ${TODAY}, interval '1 day') AS day
     LEFT JOIN payments p ON p.status = 'success' AND ${ist('p.created_at')}::date = day::date
     GROUP BY day ORDER BY day`
  );
  const byPlan = await query<{ plan: string; sales: number; paise: string; active: number }>(
    `SELECT s.plan, COALESCE(p.sales, 0)::int AS sales, COALESCE(p.paise, 0)::text AS paise, s.active::int AS active
     FROM (SELECT plan, COUNT(*) FILTER (WHERE expires_at IS NULL OR expires_at > NOW()) AS active
           FROM user_subscriptions WHERE product = $1 GROUP BY plan) s
     LEFT JOIN (SELECT plan, COUNT(*) AS sales, SUM(amount) AS paise FROM payments WHERE status = 'success' GROUP BY plan) p USING (plan)
     ORDER BY COALESCE(p.paise, 0) DESC`,
    [PRODUCT]
  );
  const recent = await query<PaymentRow>(
    `${PAYMENT_SELECT} WHERE p.status = 'success' ORDER BY p.created_at DESC LIMIT 8`
  );
  return { revenue, people, plans, practice, daily, byPlan, recent };
}

/* ───────────── payments ───────────── */

export interface PaymentRow {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  plan: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  at: string;
  name: string | null;
  phone: string;
}

const PAYMENT_SELECT = `
  SELECT p.id, p.user_id, p.amount, p.status, p.plan, p.razorpay_order_id, p.razorpay_payment_id,
         ${shown('p.created_at')} AS at, u.name, u.phone
  FROM payments p JOIN users u ON u.id = p.user_id`;

export interface PaymentFilters { status: string; plan: string; from: string; to: string; q: string }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function paymentFilters(get: (key: string) => string | undefined): PaymentFilters {
  const status = get('status') ?? '';
  const plan = get('plan') ?? '';
  const date = (v: string | undefined) => (v && DATE_RE.test(v) ? v : '');
  return {
    status: ['success', 'pending', 'failed'].includes(status) ? status : '',
    plan: Object.prototype.hasOwnProperty.call(PLANS, plan) ? plan : '',
    from: date(get('from')),
    to: date(get('to')),
    q: (get('q') ?? '').trim().slice(0, 100),
  };
}

function paymentWhere(f: PaymentFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: (n: number) => string, value: unknown) => {
    params.push(value);
    where.push(sql(params.length));
  };
  if (f.status) add((n) => `p.status = $${n}`, f.status);
  if (f.plan) add((n) => `p.plan = $${n}`, f.plan);
  if (f.from) add((n) => `${ist('p.created_at')} >= $${n}::date`, f.from);
  if (f.to) add((n) => `${ist('p.created_at')} < ($${n}::date + interval '1 day')`, f.to);
  if (f.q) add((n) => `(u.phone LIKE $${n} OR u.name ILIKE $${n} OR p.razorpay_order_id ILIKE $${n} OR p.razorpay_payment_id ILIKE $${n})`, like(f.q));
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

export async function getPayments(f: PaymentFilters, page: number) {
  const { sql, params } = paymentWhere(f);
  const rows = await query<PaymentRow>(
    `${PAYMENT_SELECT} ${sql} ORDER BY p.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    params
  );
  const summary = await query<{ status: string; count: number; paise: string }>(
    `SELECT p.status, COUNT(*)::int AS count, COALESCE(SUM(p.amount), 0)::text AS paise
     FROM payments p JOIN users u ON u.id = p.user_id ${sql} GROUP BY p.status`,
    params
  );
  return { rows, summary, total: summary.reduce((n, s) => n + s.count, 0) };
}

export function getPaymentsForExport(f: PaymentFilters) {
  const { sql, params } = paymentWhere(f);
  return query<PaymentRow>(`${PAYMENT_SELECT} ${sql} ORDER BY p.created_at DESC LIMIT 20000`, params);
}

/* ───────────── sadhak ───────────── */

export interface SadhakRow {
  id: number;
  name: string | null;
  phone: string;
  city: string | null;
  joined: string;
  plan: string | null;
  expires: string | null;
  expired: boolean;
  done: number;
  last_done: string | null;
  paid_paise: string;
}

const SADHAK_FROM = `
  FROM users u
  LEFT JOIN user_subscriptions s ON s.user_id = u.id AND s.product = '${PRODUCT}'
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS done, MAX(completed_at) AS last_at FROM daily_progress d WHERE d.user_id = u.id AND d.product = '${PRODUCT}'
  ) d ON TRUE
  LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(amount), 0) AS paise FROM payments x WHERE x.user_id = u.id AND x.status = 'success'
  ) pay ON TRUE`;

const SADHAK_SELECT = `
  SELECT u.id, u.name, u.phone, u.city, ${shownDate('u.created_at')} AS joined, s.plan,
         ${shownDate('s.expires_at')} AS expires, COALESCE(s.expires_at <= NOW(), FALSE) AS expired,
         d.done, ${shownDate('d.last_at')} AS last_done, pay.paise::text AS paid_paise
  ${SADHAK_FROM}`;

const ACTIVE = `s.plan IS NOT NULL AND (s.expires_at IS NULL OR s.expires_at > NOW())`;

export const SEGMENTS: { id: string; label: string; sql: string }[] = [
  { id: '', label: 'सभी', sql: 'TRUE' },
  { id: 'active', label: 'प्लान चालू', sql: ACTIVE },
  { id: 'stalled', label: '7 दिन से रुके', sql: `${ACTIVE} AND d.done < ${SADHANA_DAYS} AND (d.last_at IS NULL OR d.last_at < NOW() - interval '7 days')` },
  { id: 'finished', label: '40 दिन पूरे', sql: `d.done >= ${SADHANA_DAYS}` },
  { id: 'expired', label: 'प्लान समाप्त', sql: `s.expires_at <= NOW()` },
  { id: 'draft', label: 'बिना भुगतान', sql: `NOT ${everPaidSql('u')}` },
];

export interface SadhakFilters { segment: string; q: string }

export function sadhakFilters(get: (key: string) => string | undefined): SadhakFilters {
  const segment = get('segment') ?? '';
  return { segment: SEGMENTS.some((s) => s.id === segment) ? segment : '', q: (get('q') ?? '').trim().slice(0, 100) };
}

function sadhakWhere(f: SadhakFilters) {
  const conditions = [SEGMENTS.find((s) => s.id === f.segment)!.sql];
  const params: unknown[] = [];
  if (f.q) {
    params.push(like(f.q));
    conditions.push(`(u.phone LIKE $1 OR u.name ILIKE $1 OR u.city ILIKE $1)`);
  }
  return { sql: `WHERE ${conditions.join(' AND ')}`, params };
}

export async function getSadhaks(f: SadhakFilters, page: number) {
  const { sql, params } = sadhakWhere(f);
  const rows = await query<SadhakRow>(
    `${SADHAK_SELECT} ${sql} ORDER BY u.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    params
  );
  const [{ total }] = await query<{ total: number }>(`SELECT COUNT(*)::int AS total ${SADHAK_FROM} ${sql}`, params);
  return { rows, total };
}

export function getSadhaksForExport(f: SadhakFilters) {
  const { sql, params } = sadhakWhere(f);
  return query<SadhakRow>(`${SADHAK_SELECT} ${sql} ORDER BY u.created_at DESC LIMIT 20000`, params);
}

export async function getSadhak(id: number) {
  const [user] = await query<
    SadhakRow & { age: number | null; gender: string | null; signup_source: string | null; sadhak_code: string | null; completed_on: string | null; ever_paid: boolean }
  >(
    `SELECT u.id, u.name, u.phone, u.city, ${shownDate('u.created_at')} AS joined, s.plan,
            ${shownDate('s.expires_at')} AS expires, COALESCE(s.expires_at <= NOW(), FALSE) AS expired,
            d.done, ${shownDate('d.last_at')} AS last_done, pay.paise::text AS paid_paise,
            u.age, u.gender, u.signup_source, u.sadhak_code, ${shownDate('u.sadhana_completed_at')} AS completed_on,
            ${everPaidSql('u')} AS ever_paid
     ${SADHAK_FROM} WHERE u.id = $1`,
    [id]
  );
  if (!user) return null;
  const payments = await query<PaymentRow>(`${PAYMENT_SELECT} WHERE p.user_id = $1 ORDER BY p.created_at DESC`, [id]);
  const days = await query<{ day_number: number; at: string }>(
    `SELECT day_number, ${shown('completed_at')} AS at FROM daily_progress WHERE user_id = $1 AND product = $2 ORDER BY day_number`,
    [id, PRODUCT]
  );
  return { user, payments, days };
}
