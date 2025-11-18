/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Reduce memory usage during build
  experimental: {
    // Disable features that use more memory
    optimizeCss: false,
  },
  // Optimize memory usage
  swcMinify: true,
};

module.exports = nextConfig;
























