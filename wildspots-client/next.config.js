/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable webpack for compatibility with existing config
  experimental: {
    webpackBuildWorker: true,
  },
  // Explicitly set webpack as the bundler
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

module.exports = nextConfig;
