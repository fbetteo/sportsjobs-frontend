import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';

export async function middleware(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (!session) {
    return NextResponse.redirect('/api/auth/login');
  }

  return res;
}

export const config = {
  matcher: ['/protected/:path*'],
};