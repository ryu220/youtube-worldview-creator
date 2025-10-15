/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['generativelanguage.googleapis.com', 'placehold.co', 'image.pollinations.ai'],
  },
};

module.exports = nextConfig;
