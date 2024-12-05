import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
// import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  // Check if the request is for an old Airtable job URL
  const oldIdMatch = pathname.match(/^\/jobs\/(rec[a-zA-Z0-9_-]+)$/);
  if (oldIdMatch) {
    const airtableId = oldIdMatch[1];

    try {
      // Query the database for the corresponding Postgres ID
      const filters: Record<string, string> = {};
      if (airtableId) filters.airtable_id = airtableId;

      const requestBody = {
        limit: 1,
        filters: Object.keys(filters).length > 0 ? filters : null,
        sort_by: "creation_date",
        sort_direction: "desc"
      };
    
      const result = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
    
      const records = await result.json();
      // console.log(records);

      if (records && records.length > 0)  {
        const newId = records[0].job_id;
        const newUrl = new URL(`/jobs/${newId}`, request.url);
        return NextResponse.redirect(newUrl, 301);
      }
    } catch (error) {
      console.error('Database query failed:', error);
    }
  }
  // Continue to the requested route if no mapping is found
  return NextResponse.next();
}

export const config = {
  matcher: ['/jobs/:path*'], // Apply middleware to protected and job routes
};

// export async function middleware(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getSession(req, res);

//   if (!session) {
//     return NextResponse.redirect('/api/auth/login');
//   }

//   return res;
// }

// export const config = {
//   matcher: ['/protected/:path*'],
// };