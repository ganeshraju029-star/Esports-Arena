/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'out',
  generateEtags: false,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
