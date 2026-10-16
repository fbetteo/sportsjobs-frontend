/** @type {import('next').NextConfig} */
const nextConfig = {
    // Config redirects are served by the CDN without invoking a function.
    async redirects() {
      return [
        // Old links that Google indexed under /job/[id].
        { source: '/job/:id', destination: '/jobs/:id', permanent: false },
        { source: '/member-plan', destination: '/signup', permanent: true },
      ];
    },
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


