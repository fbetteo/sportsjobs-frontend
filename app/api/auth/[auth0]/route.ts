import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import type { Session } from '@auth0/nextjs-auth0';
import type { NextRequest } from 'next/server';
import { AuthIdentity, ensureBackendUserProfile } from '../../../../lib/userProfileBackend';

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback: async (_req: NextRequest, session: Session) => {
      try {
        await ensureBackendUserProfile(session.user as AuthIdentity);
      } catch (error) {
        console.error('Failed to ensure backend user after Auth0 callback:', error);
      }

      return session;
    },
  }),
});
// export const POST = handleAuth();
// export const PUT = handleAuth();
// export const DELETE = handleAuth();
