import { fetchJobDetails } from '@/lib/fetchJobDetails';
import { NextResponse } from 'next/server';

// This is to redirect old dynamic jobposts to new ones or home page

export async function GET(request: Request) {
  try {
    // Extract the slug from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    const jobId = pathParts[pathParts.length - 1];
    
    // Fetch the job details
    const jobResult = await fetchJobDetails(jobId);
    if (!jobResult) return NextResponse.redirect('https://www.sportsjobs.online/', 301);

    const { job, expired } = jobResult;
    if (job) {
      // If the job exists, redirect to the new URL
      return NextResponse.redirect(`https://www.sportsjobs.online/jobs/${job.id}`, 301);
    } else {
      // If the job doesn't exist, redirect to the homepage
      return NextResponse.redirect('https://www.sportsjobs.online/', 301);
    }
  } catch (error) {
    // Log the error for debugging if needed
    console.error('Error fetching job details:', error);

    // Redirect to the homepage on any error
    return NextResponse.redirect('https://www.sportsjobs.online/', 301);
  }
}
//   const slug = url.pathname.replace('/job-details/', '');

//   // Optionally, log the slug for debugging
//   console.log('Captured slug:', slug);

//   // Redirect to the homepage (or another relevant page)
//   return NextResponse.redirect('https://www.sportsjobs.online/', 301);
// }