import { query } from './db';

// Same database (and schema) as the old app (bhaktiamrit) — users who join here
// get their Hanuman subscription there too. Only add-only changes below the old ones.
//
// Schema setup is idempotent but runs ~20 statements, so it's done once per
// server process; a failed run clears the memo so the next request retries.
// Kept on globalThis because `npm run dev` reloads this module on every edit, which would otherwise
// run all of it against the remote database again and make each page feel slow.
const memo = globalThis as typeof globalThis & { hsMigration?: Promise<void> | null };

export function migrate(): Promise<void> {
  if (!memo.hsMigration) {
    memo.hsMigration = runMigrations().catch((err) => {
      memo.hsMigration = null;
      throw err;
    });
  }
  return memo.hsMigration;
}

async function runMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) UNIQUE NOT NULL,
      name VARCHAR(100),
      is_paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Add is_paid column if it doesn't exist (for existing installs)
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE
  `);

  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(10)
  `);

  // NULL = plan never expires (full/lifetime/legacy trial). Only time-limited
  // plans (e.g. yearly) get a real timestamp here.
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP
  `);

  // Grandfather pre-existing paid users (from before per-plan pricing) into the full 40-day plan
  await query(`
    UPDATE users SET plan='full' WHERE is_paid=TRUE AND plan IS NULL
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) NOT NULL,
      code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // MeraOTP now generates the OTP itself; we only keep its message_id for verification
  await query(`ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS message_id VARCHAR(64)`);
  await query(`ALTER TABLE otp_codes ALTER COLUMN code DROP NOT NULL`);

  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      razorpay_order_id VARCHAR(100) NOT NULL,
      razorpay_payment_id VARCHAR(100),
      razorpay_signature VARCHAR(300),
      amount INTEGER NOT NULL DEFAULT 19900,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan VARCHAR(10) NOT NULL DEFAULT 'full'
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS daily_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 40),
      completed_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, day_number)
    )
  `);

  // Widen day_number to 42 — gives 2 hidden buffer/makeup days beyond the
  // marketed 40. UI and the certificate (still >=40 completed) are unaffected.
  await query(`ALTER TABLE daily_progress DROP CONSTRAINT IF EXISTS daily_progress_day_number_check`);
  await query(`ALTER TABLE daily_progress ADD CONSTRAINT daily_progress_day_number_check CHECK (day_number BETWEEN 1 AND 42)`);

  // ── Multiple sadhanas: one login, a separate subscription + progress per product ──
  // Everything that existed before is the Hanuman 40-day sadhana.
  await query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS product VARCHAR(40) NOT NULL DEFAULT 'hanuman-40'`);
  await query(`ALTER TABLE daily_progress ADD COLUMN IF NOT EXISTS product VARCHAR(40) NOT NULL DEFAULT 'hanuman-40'`);
  await query(`ALTER TABLE daily_progress DROP CONSTRAINT IF EXISTS daily_progress_user_id_day_number_key`);
  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS daily_progress_user_product_day_idx
    ON daily_progress (user_id, product, day_number)
  `);

  // NULL expires_at = never expires.
  await query(`
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product VARCHAR(40) NOT NULL,
      plan VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, product)
    )
  `);

  // Carry the legacy single-product plan (users.plan) over as a Hanuman
  // subscription. users.plan is no longer written, so this only ever fills gaps.
  await query(`
    INSERT INTO user_subscriptions (user_id, product, plan, expires_at)
    SELECT id, 'hanuman-40', plan, plan_expires_at FROM users
    WHERE is_paid=TRUE AND plan IS NOT NULL
    ON CONFLICT (user_id, product) DO NOTHING
  `);

  // ── hanumansadhak.com signup: extra profile fields + the 5 sankalp answers ──
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS age SMALLINT`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sankalp JSONB`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS signup_source VARCHAR(40)`);

  // Fast2SMS login: we generate the OTP ourselves (stored in `code`); wrong tries are counted.
  await query(`ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS attempts SMALLINT NOT NULL DEFAULT 0`);

  // Certificate QR: a public code (only once the 40 days are finished) and when they were finished.
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sadhak_code VARCHAR(10)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sadhana_completed_at TIMESTAMP`);
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_sadhak_code_idx ON users (sadhak_code)`);
}
