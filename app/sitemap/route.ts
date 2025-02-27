import { NextResponse } from 'next/server';
import { fetchJobs } from '../../lib/fetchJobs';
import { fetchBlogPosts } from '@/lib/fetchBlogPosts';
import { fetchCompanies } from '@/lib/fetchCompanies';

// Add this helper function at the top of the file, after the imports
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  // Use the correct base URL depending on your environment
  const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.sportsjobs.online' 
  : 'http://localhost:3000';

  const jobs = await fetchJobs(1000, JSON.stringify(""));
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

  // Fetch companies
  const companies = await fetchCompanies();
  if (!Array.isArray(companies)) {
    throw new Error('Expected companies to be an array');
  }

  // Define static pages
  const staticPages = ['', '/signup', '/blog', '/company-jobs'].map((route) => `${baseUrl}${route}`);
  const jobUrls = recentJobs.map((job: any) => `${baseUrl}/jobs/${job.id}`);
  const blogpostsUrls = blogposts.map((blogpost: any) => `${baseUrl}/blogposts/${blogpost.blog_id}`);
  const companyUrls = companies.map((company: any) => 
    `${baseUrl}/company/${company.company.toLowerCase().replace(/\s+/g, '-')}`
  );
  const allPages = [...staticPages, ...jobUrls, ...blogpostsUrls, ...companyUrls];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((url) => {
          return `
            <url>
               <loc>${escapeXml(url)}</loc>
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
