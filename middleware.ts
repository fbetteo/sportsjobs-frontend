import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchJobs } from './lib/fetchJobs';
import { fetchBlogPosts } from './lib/fetchBlogPosts';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/member-plan') {
    return NextResponse.redirect(`${request.nextUrl.origin}/signup`, 301);
  }

  const oldJobIdMatch = pathname.match(/^\/jobs\/(rec[A-Za-z0-9]{14,17})/);
  const oldBlogIdMatch = pathname.match(/^\/blogposts\/(rec[A-Za-z0-9]{14,17})/);
  console.log('Pathname:', pathname);
  
  if (oldJobIdMatch) {
    const airtableId = oldJobIdMatch[1];
    console.log('Job Airtable ID:', airtableId);
    
    try {
      const filters = {
        airtable_id: airtableId.trim()
      };
      
      const jobs = await fetchJobs(1, JSON.stringify(filters));

      if (jobs?.length > 0) {
        const newId = jobs[0].id || jobs[0].job_id;
        if (newId) {
          return NextResponse.redirect(`${request.nextUrl.origin}/jobs/${newId}`, 301);
        }
      }
      return NextResponse.redirect(`${request.nextUrl.origin}`, 302);
    } catch (error) {
      console.error('Job lookup failed:', error);
      return NextResponse.redirect(`${request.nextUrl.origin}`, 302);
    }
  }

  if (oldBlogIdMatch) {
    const airtableId = oldBlogIdMatch[1];
    console.log('Blog Airtable ID:', airtableId);
    
    try {
      const filters = {
        airtable_id: airtableId.trim()
      };
      
      const posts = await fetchBlogPosts(1, JSON.stringify(filters));
      console.log('Fetched posts:', posts); // Debug log

      if (posts && Array.isArray(posts) && posts.length > 0) {
        const newId = posts[0].blog_id;
        if (newId) {
          console.log('Redirecting to new blog ID:', newId); // Debug log
          return NextResponse.redirect(`${request.nextUrl.origin}/blogposts/${newId}`, 301);
        }
      }
      console.log('No matching blog post found, redirecting to /blog'); // Debug log
      return NextResponse.redirect(`${request.nextUrl.origin}/blog`, 302);
    } catch (error) {
      console.error('Blog lookup failed:', error);
      return NextResponse.redirect(`${request.nextUrl.origin}/blog`, 302);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/jobs/:path*', '/blogposts/:path*', '/member-plan'],
};