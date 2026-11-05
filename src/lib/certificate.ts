import { randomInt } from 'crypto';
import { query } from './db';

// No 0/O, 1/I: the code may get read out or typed in.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const SADHAK_CODE_RE = /^[A-Z2-9]{10}$/;

function newCode(): string {
  return Array.from({ length: 10 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
}

// Called once a sadhak has finished the 40 days. The code is random, not their user id, so nobody can
// walk through /sadhak/1, /sadhak/2… and list every sadhak; it stays the same if they repeat the sadhana.
export async function issueCertificate(userId: number, completedAt: Date): Promise<string> {
  const rows = await query<{ sadhak_code: string }>(
    `UPDATE users SET sadhak_code = COALESCE(sadhak_code, $2), sadhana_completed_at = $3 WHERE id = $1 RETURNING sadhak_code`,
    [userId, newCode(), completedAt]
  );
  return rows[0].sadhak_code;
}

export interface VerifiedSadhak {
  name: string | null;
  // Already masked here, so the full number never reaches the public page.
  phone: string;
  completedAt: Date;
}

export function maskPhone(phone: string): string {
  return `${'X'.repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
}

export async function findVerifiedSadhak(code: string): Promise<VerifiedSadhak | null> {
  if (!SADHAK_CODE_RE.test(code)) return null;
  const rows = await query<{ name: string | null; phone: string; sadhana_completed_at: Date }>(
    `SELECT name, phone, sadhana_completed_at FROM users WHERE sadhak_code = $1 AND sadhana_completed_at IS NOT NULL`,
    [code]
  );
  const row = rows[0];
  return row ? { name: row.name, phone: maskPhone(row.phone), completedAt: row.sadhana_completed_at } : null;
}
