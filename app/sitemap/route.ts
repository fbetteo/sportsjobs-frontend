import { NextResponse } from 'next/server';
import { fetchJobs } from '../../lib/fetchJobs';

export async function GET() {
  // Use the correct base URL depending on your environment
  const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.sportsjobs.online' 
  : 'http://localhost:3000';

  const jobs = await fetchJobs(1000, JSON.stringify(""));
  if (!Array.isArray(jobs)) {
    throw new Error('Expected jobs to be an array');
  }

  // Define static pages
  const staticPages = ['', '/signup'].map((route) => `${baseUrl}${route}`);
  const jobUrls = jobs.map((job: any) => `${baseUrl}/jobs/${job.id}`);
  const allPages = [...staticPages, ...jobUrls];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    </urlset>
  `.trim();

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}