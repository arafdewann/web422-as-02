/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos"], // Allow images from external sources
  },
};

export default nextConfig;
