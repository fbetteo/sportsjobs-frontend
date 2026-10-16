import { NextResponse } from 'next/server';

// Crawlers that send no job seekers but render thousands of job pages, which costs
// Vercel CPU, ISR reads/writes, and origin transfer. Crawl-delay is ignored by most of
// them, so they are disallowed outright. Search engines and AI assistants stay allowed.
const BLOCKED_CRAWLERS = [
  'GPTBot', // Was doing 81K requests/12h; OAI-SearchBot (ChatGPT search) is still allowed.
  'meta-externalagent',
  'Bytespider',
  'PetalBot',
  'barkrowler',
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'DataForSeoBot',
  'BLEXBot',
  'serpstatbot',
];

// Job list APIs stay crawlable: Google needs them to render client-side company and country pages.
const robotsTxt = [
  'User-agent: *',
  'Disallow: /api/auth/',
  'Disallow: /api/dropdown-options',
  'Allow: /',
  '',
  ...BLOCKED_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Disallow: /', '']),
  'Sitemap: https://www.sportsjobs.online/sitemap.xml',
  '',
  '# LLM-friendly content for AI assistants: https://www.sportsjobs.online/llms.txt',
].join('\n');

export async function GET() {
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      // Cache robots.txt for 7 days (rarely changes)
      'Cache-Control': 'public, s-maxage=604800, max-age=86400, stale-while-revalidate=1209600',
    },
  });
}
