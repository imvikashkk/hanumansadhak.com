import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

// Update the sadhak's name (shown on the dashboard and printed on the certificate).
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'कृपया पहले Login करें' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
  if (!name || name.length > 100) {
    return NextResponse.json({ error: 'कृपया सही नाम डालें (100 अक्षर तक)' }, { status: 400 });
  }

  await query(`UPDATE users SET name=$1 WHERE id=$2`, [name, session.userId]);
  return NextResponse.json({ success: true, name });
}
