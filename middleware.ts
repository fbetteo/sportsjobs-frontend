import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchJobs } from './lib/fetchJobs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const oldIdMatch = pathname.match(/^\/jobs\/(rec[A-Za-z0-9]{14,17})/);
  console.log('Pathname:', pathname);
  
  if (oldIdMatch) {
    const airtableId = oldIdMatch[1];
    console.log('Airtable ID:', airtableId);
    
    try {
      // Format filter exactly as your working curl command
      const filters = {
        airtable_id: airtableId.trim() // Ensure no whitespace
      };
      
      console.log('Sending filters:', JSON.stringify(filters)); // Debug log
      const jobs = await fetchJobs(1, JSON.stringify(filters));
      // console.log('Received jobs:', jobs); // Debug log

      if (jobs?.length > 0) {
        const newId = jobs[0].id || jobs[0].job_id;
        if (newId) {
          return NextResponse.redirect(`${request.nextUrl.origin}/jobs/${newId}`, 301);
        }
      }
      // Fallback to jobs page if no match
      return NextResponse.redirect(`${request.nextUrl.origin}/jobs`, 302);
    } catch (error) {
      console.error('Job lookup failed:', error);
      return NextResponse.redirect(`${request.nextUrl.origin}/jobs`, 302);
    }
  }
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