/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
  },
  // Add any other Next.js configuration options here
};

module.exports = nextConfig;
