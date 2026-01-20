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
              value: 'public, s-maxage=86400, max-age=3600, stale-while-revalidate=604800',
            },
          ],
        },
      ];
    },
  };

export default nextConfig;


