// app/sitemap/route.ts
import { NextResponse } from 'next/server';
import { fetchJobs } from '@/lib/fetchJobs';


export async function GET() {
  const baseUrl = 'https://www.sportsjobs.online';
  
  // Fetch job listings dynamically
  const response = await fetch(`${baseUrl}/api/get-jobs?limit=1000`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch job listings');
  }

    const { jobs } = await response.json();
    
    // Ensure `jobs` is an array before mapping
    if (!Array.isArray(jobs)) {
        throw new Error('Expected jobs to be an array');
      }
  // Static pages (adjust based on your website structure)
  const staticPages = ['', '/signup'].map(
    (route) => `${baseUrl}${route}`
  );

  // Generate job URLs
  const jobUrls = jobs.map(
    (job: any) => `${baseUrl}/jobs/${job.id}`
    );
    
    // console.log(jobUrls.length);
  // Combine static pages and job URLs
  const allPages = [...staticPages, ...jobUrls];

  // Generate sitemap XML
  const sitemap = `
    ${allPages
      .map((url) => {
        return `
          <url>
            <loc>${url}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
      })
      .join('')}
  `;

  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?> 
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      ${sitemap} 
    </urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
