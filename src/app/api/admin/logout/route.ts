import { NextResponse } from 'next/server';
import { endAdminSession } from '@/lib/admin-auth';

export async function POST() {
  await endAdminSession();
  return NextResponse.json({ success: true });
}
