import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie, signToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { everPaidSql } from '@/lib/ever-paid';
import { migrate } from '@/lib/migrate';
import { isTester } from '@/lib/testers';

const MAX_ATTEMPTS = 5;

interface OtpRow { id: number; code: string | null; attempts: number }
interface UserRow { id: number; phone: string }

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json().catch(() => ({}));
    if (!phone || !/^\d{6}$/.test(String(code ?? ''))) {
      return NextResponse.json({ error: 'कृपया 6 अंकों का OTP डालें' }, { status: 400 });
    }

    await migrate();
    const otps = await query<OtpRow>(
      `SELECT id, code, attempts FROM otp_codes WHERE phone=$1 AND used=FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );
    const otp = otps[0];
    if (!otp?.code) {
      return NextResponse.json({ error: 'OTP की समय सीमा खत्म हो गई — नया OTP मंगाएं' }, { status: 401 });
    }
    if (otp.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'बहुत बार गलत OTP डाला गया — नया OTP मंगाएं' }, { status: 429 });
    }

    if (!timingSafeEqual(Buffer.from(otp.code), Buffer.from(String(code)))) {
      await query(`UPDATE otp_codes SET attempts=attempts+1 WHERE id=$1`, [otp.id]);
      return NextResponse.json({ error: 'OTP गलत है, कृपया दोबारा जाँचें' }, { status: 401 });
    }

    await query(`UPDATE otp_codes SET used=TRUE WHERE id=$1`, [otp.id]);
    // Checked again here: a code sent before this rule, or left over, must not open a session.
    const users = await query<UserRow>(`SELECT u.id, u.phone FROM users u WHERE u.phone=$1 AND (${everPaidSql('u')} OR $2)`, [phone, isTester(String(phone))]);
    if (!users.length) {
      return NextResponse.json({ error: 'इस नंबर पर अभी साधना जॉइन नहीं हुई — कृपया Signup करें', signup: true }, { status: 404 });
    }

    await setSessionCookie(signToken({ userId: users[0].id, phone: users[0].phone }));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें' }, { status: 500 });
  }
}
