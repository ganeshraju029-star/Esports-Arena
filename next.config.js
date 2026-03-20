/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export for Netlify
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  // Only enable rewrites in development mode
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: '/api/*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    },
  }),
}

module.exports = nextConfig
