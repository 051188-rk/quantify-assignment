/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static export
  output: 'export',
  // Add base path if your app is not deployed at the root
  // basePath: '/frontend',
  // Configure images if you're using Next.js Image component
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
