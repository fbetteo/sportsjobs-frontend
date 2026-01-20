/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/sitemap.xml',
          destination: '/sitemap',
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/jobs/:id*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, s-maxage=3600, max-age=600, stale-while-revalidate=7200',
            },
          ],
        },
      ];
    },
  };

export default nextConfig;


