/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export for Netlify
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  // Enable rewrites only in development mode without static export
  ...(process.env.NODE_ENV === 'development' && {
    output: undefined, // Override static export in development
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    },
  }),
}

module.exports = nextConfig
