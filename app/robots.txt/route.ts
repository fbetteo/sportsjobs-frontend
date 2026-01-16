import { NextResponse } from 'next/server';

export async function GET() {
  // Define the content of the robots.txt file
  const robotsTxt = `
    User-agent: *
    Disallow: /api/dropdown-options
    Allow: /

    Sitemap: https://www.sportsjobs.online/sitemap.xml
    
    # LLM-friendly content for AI assistants
    # See https://llmstxt.org for more information
    Allow: /llms.txt
  `.trim(); // trim to remove any extra whitespace

  // Return the robots.txt content with the correct content type
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      // Cache robots.txt for 7 days (rarely changes)
      'Cache-Control': 'public, s-maxage=604800, max-age=86400, stale-while-revalidate=1209600',
    },
  });
}
