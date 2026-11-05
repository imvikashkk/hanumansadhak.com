import { randomInt } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { PHONE_RE } from '@/data/signup';
import { query } from '@/lib/db';
import { everPaidSql } from '@/lib/ever-paid';
import { migrate } from '@/lib/migrate';
import { sendOtpSms } from '@/lib/sms';
import { isTester } from '@/lib/testers';

const RESEND_AFTER_SEC = 30;
const OTP_VALID_MIN = 10;

// Login is only for numbers that have paid at least once; everyone else signs up again.
// Same answer for an unknown and a never-paid number: neither has an account to log in to.
export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json().catch(() => ({}));
    if (!PHONE_RE.test(String(phone ?? ''))) {
      return NextResponse.json({ error: 'कृपया सही 10 अंकों का मोबाइल नंबर डालें' }, { status: 400 });
    }

    await migrate();
    const users = await query(`SELECT u.id FROM users u WHERE u.phone=$1 AND (${everPaidSql('u')} OR $2)`, [phone, isTester(phone)]);
    if (!users.length) {
      return NextResponse.json({ error: 'इस नंबर पर अभी साधना जॉइन नहीं हुई — कृपया Signup करें', signup: true }, { status: 404 });
    }

    const recent = await query(
      `SELECT id FROM otp_codes WHERE phone=$1 AND created_at > NOW() - make_interval(secs => $2)`,
      [phone, RESEND_AFTER_SEC]
    );
    if (recent.length) {
      return NextResponse.json({ error: `कृपया ${RESEND_AFTER_SEC} सेकंड बाद फिर कोशिश करें` }, { status: 429 });
    }

    const code = String(randomInt(100000, 1000000));
    if (!(await sendOtpSms(phone, code, OTP_VALID_MIN))) {
      return NextResponse.json({ error: 'OTP भेजने में समस्या हुई, कृपया फिर कोशिश करें' }, { status: 502 });
    }

    // Any older unused code stops working once a new one is sent.
    await query(`UPDATE otp_codes SET used=TRUE WHERE phone=$1 AND used=FALSE`, [phone]);
    await query(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
      [phone, code, OTP_VALID_MIN]
    );

    return NextResponse.json({ success: true, resendAfter: RESEND_AFTER_SEC });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें' }, { status: 500 });
  }
}
