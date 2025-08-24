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
    if (!jobResult) {
      // Job doesn't exist - return 410 to optimize crawl budget
      return new Response('This job posting has been permanently removed.', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    const { job, expired } = jobResult;
    if (job) {
      // If the job exists, redirect to preserve backlinks (301 passes ~99% link equity)
      return NextResponse.redirect(`https://www.sportsjobs.online/jobs/${job.id}`, 301);
    } else {
      // Job doesn't exist - return 410 to optimize crawl budget
      return new Response('This job posting has been permanently removed.', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    // Log the error for debugging if needed
    console.error('Error fetching job details:', error);

    // On error, return 410 since we can't verify the job exists
    return new Response('This job posting has been permanently removed.', {
      status: 410,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
//   const slug = url.pathname.replace('/job-details/', '');

//   // Optionally, log the slug for debugging
//   console.log('Captured slug:', slug);

//   // Redirect to the homepage (or another relevant page)
//   return NextResponse.redirect('https://www.sportsjobs.online/', 301);
// }