/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    outputFileTracingIgnores: ['**/node_modules/.cache/**'],
  },
};

module.exports = nextConfig;
