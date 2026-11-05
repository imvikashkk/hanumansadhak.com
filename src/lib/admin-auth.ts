import { createHash, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'hk_admin_session';
const MAX_AGE_SEC = 60 * 60 * 12;

export function isAdminToken(token: string): boolean {
  try {
    return (jwt.verify(token, process.env.JWT_SECRET!) as { admin?: boolean }).admin === true;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  return !!token && isAdminToken(token);
}

// For admin pages. API routes check isAdmin() and answer 401 instead.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}

export async function startAdminSession() {
  (await cookies()).set(COOKIE, jwt.sign({ admin: true }, process.env.JWT_SECRET!, { expiresIn: MAX_AGE_SEC }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC,
    path: '/',
  });
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}

// Hashed first so both sides are the same length, and the comparison takes the same time however
// much of the guess is right.
function same(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

export function checkAdminLogin(userId: string, password: string): boolean {
  const { ADMIN_USER_ID, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER_ID || !ADMIN_PASSWORD) return false;
  // Both are always checked, so timing doesn't reveal which one was wrong.
  const idOk = same(userId, ADMIN_USER_ID);
  const passwordOk = same(password, ADMIN_PASSWORD);
  return idOk && passwordOk;
}

// Slows down password guessing, per server process (enough for a single-server site). The address
// comes from a header that can be faked, so there is also a ceiling across all addresses.
const MAX_FAILS = 5;
const MAX_FAILS_ALL = 30;
const LOCK_MS = 15 * 60 * 1000;
const ALL = '*';
const fails = new Map<string, { count: number; until: number }>();

function minutesLeft(key: string, limit: number): number {
  const entry = fails.get(key);
  if (!entry || entry.count < limit) return 0;
  const left = entry.until - Date.now();
  if (left <= 0) {
    fails.delete(key);
    return 0;
  }
  return Math.ceil(left / 60000);
}

export function loginLockedMinutes(ip: string): number {
  return Math.max(minutesLeft(ip, MAX_FAILS), minutesLeft(ALL, MAX_FAILS_ALL));
}

export function recordLoginResult(ip: string, ok: boolean) {
  if (ok) {
    fails.delete(ip);
    return;
  }
  for (const key of [ip, ALL]) {
    fails.set(key, { count: (fails.get(key)?.count ?? 0) + 1, until: Date.now() + LOCK_MS });
  }
}
