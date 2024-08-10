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
  };

export default nextConfig;


