import { AppRouteHandlerFnContext, handleAuth, handleCallback, handleLogout } from '@auth0/nextjs-auth0';
import type { Session } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { AuthIdentity, ensureBackendUserProfile } from '../../../../lib/userProfileBackend';
import { sessionHintCookie } from '../../../../lib/sessionHint';

const afterCallback = async (_req: NextRequest, session: Session) => {
  try {
    await ensureBackendUserProfile(session.user as AuthIdentity);
  } catch (error) {
    console.error('Failed to ensure backend user after Auth0 callback:', error);
  }

  return session;
};

// Copy the SDK response so its headers are mutable, then set or clear the session hint.
function withSessionHint(response: Response, value: '1' | '') {
  const out = new NextResponse(response.body, response);
  out.headers.append('Set-Cookie', sessionHintCookie(value));
  return out;
}

export const GET = handleAuth({
  callback: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
    const response = (await handleCallback(req, ctx, { afterCallback })) as Response;
    return response.status < 400 ? withSessionHint(response, '1') : response;
  },
  logout: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
    const response = (await handleLogout(req, ctx)) as Response;
    return withSessionHint(response, '');
  },
});
// export const POST = handleAuth();
// export const PUT = handleAuth();
// export const DELETE = handleAuth();
