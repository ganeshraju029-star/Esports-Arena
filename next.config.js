/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  generateEtags: false,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
