import { NextRequest, NextResponse } from 'next/server';
import { checkAdminLogin, loginLockedMinutes, recordLoginResult, startAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const locked = loginLockedMinutes(ip);
  if (locked) {
    return NextResponse.json({ error: `बहुत बार गलत कोशिश हुई — ${locked} मिनट बाद फिर करें` }, { status: 429 });
  }

  const { userId, password } = await req.json().catch(() => ({}));
  const ok = checkAdminLogin(String(userId ?? ''), String(password ?? ''));
  recordLoginResult(ip, ok);
  if (!ok) return NextResponse.json({ error: 'गलत User ID या पासवर्ड' }, { status: 401 });

  await startAdminSession();
  return NextResponse.json({ success: true });
}
