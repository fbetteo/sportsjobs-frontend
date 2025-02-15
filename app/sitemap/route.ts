import { NextResponse } from 'next/server';
import { fetchJobs } from '../../lib/fetchJobs';
import { fetchBlogPosts } from '@/lib/fetchBlogPosts';

export async function GET() {
  // Use the correct base URL depending on your environment
  const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.sportsjobs.online' 
  : 'http://localhost:3000';

  const jobs = await fetchJobs(500, JSON.stringify(""));
  if (!Array.isArray(jobs)) {
    throw new Error('Expected jobs to be an array');
  }

  // Filter jobs to only include those from the last 60 days
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  
  const recentJobs = jobs.filter((job: any) => {
    const jobDate = new Date(job.start_date);
    return jobDate >= sixtyDaysAgo;
  });

  const blogposts = await fetchBlogPosts(100, JSON.stringify(""));
  if (!Array.isArray(blogposts)) {
    throw new Error('Expected blogposts to be an array');
  }


  // Define static pages
  const staticPages = ['', '/signup', '/blog'].map((route) => `${baseUrl}${route}`);
  const jobUrls = recentJobs.map((job: any) => `${baseUrl}/jobs/${job.id}`);
  const blogpostsUrls = blogposts.map((blogpost: any) => `${baseUrl}/blogposts/${blogpost.blog_id}`);
  const allPages = [...staticPages, ...jobUrls, ...blogpostsUrls];

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
