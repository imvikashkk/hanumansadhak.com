import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Signup/login aren't here: whether a logged-in user may stay on them depends on whether they
// have ever paid, which those pages check themselves.
const NEEDS_LOGIN = ['/sadhana', '/profile'];
const NEEDS_ACCOUNT = ['/payment', '/thank-you'];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // Verified, not just present: an expired cookie must count as logged out.
  const token = req.cookies.get('hk_session')?.value;
  const loggedIn = !!token && !!verifyToken(token);

  if (NEEDS_LOGIN.some((p) => pathname.startsWith(p)) && !loggedIn) {
    // Remember where they were headed, so login lands them back there.
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  if (NEEDS_ACCOUNT.some((p) => pathname.startsWith(p)) && !loggedIn) {
    return NextResponse.redirect(new URL('/signup', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/sadhana/:path*', '/profile/:path*', '/payment/:path*', '/thank-you'],
};
