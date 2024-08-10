import { NextResponse } from 'next/server';

export async function GET() {
  // Define the content of the robots.txt file
  const robotsTxt = `
    User-agent: *
    Disallow: /job-details/
    Allow: /

    Sitemap: https://www.sportsjobs.online/sitemap.xml
  `.trim(); // trim to remove any extra whitespace

  // Return the robots.txt content with the correct content type
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
