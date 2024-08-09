// app/sitemap/route.ts
import { NextResponse } from 'next/server';
import { fetchJobs } from '@/lib/fetchJobs';


export async function GET() {
  const baseUrl = 'https://www.sportsjobs.online';
  
  // Fetch job listings dynamically
  const jobs = await fetchJobs(1000, JSON.stringify(""));
    // console.log(jobs.length);
  
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
