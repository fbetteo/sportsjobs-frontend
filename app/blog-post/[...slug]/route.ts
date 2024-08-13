import { fetchBlogPostDetails } from '@/lib/fetchBlogPostDetails';
import { fetchJobDetails } from '@/lib/fetchJobDetails';
import { NextResponse } from 'next/server';

// This is to redirect old dynamic blog posts to new ones or home page

export async function GET(request: Request) {
  // Extract the slug from the URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/'); 
  const blogpostId = pathParts[pathParts.length - 1];
  const blogpost = await fetchBlogPostDetails(blogpostId);

  if (blogpost) {
    // If the job exists, redirect to the new URL
    return NextResponse.redirect(`https://www.sportsjobs.online/blogposts/${blogpost.id}`, 301);
  } else {
    // If the job doesn't exist, redirect to the homepage
    return NextResponse.redirect('https://www.sportsjobs.online/', 301);
  }
}
//   const slug = url.pathname.replace('/job-details/', '');

//   // Optionally, log the slug for debugging
//   console.log('Captured slug:', slug);

//   // Redirect to the homepage (or another relevant page)
//   return NextResponse.redirect('https://www.sportsjobs.online/', 301);
// }