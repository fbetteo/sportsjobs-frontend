import { fetchJobDetails } from '@/lib/fetchJobDetails';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract the slug from the URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/'); 
  const jobId = pathParts[pathParts.length - 1];
  const job = await fetchJobDetails(jobId);

  if (job) {
    // If the job exists, redirect to the new URL
    return NextResponse.redirect(`https://www.sportsjobs.online/jobs/${job.id}`, 301);
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