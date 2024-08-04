import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (!session) {
    return NextResponse.redirect('/api/auth/login');
  }

  return res;
}

export const config = {
  matcher: ['/protected/:path*'],
};