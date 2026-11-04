/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  images: {
    // Next.js automatic WebP conversion, responsive srcsets, and retina scaling
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    deviceSizes: [320, 375, 390, 430, 640, 768, 820, 1024, 1280, 1366, 1440, 1920, 2560, 3840],
    imageSizes: [64, 128, 256, 384, 512, 750],
    qualities: [85, 90, 100],
    formats: ['image/webp'],
    minimumCacheTTL: 2592000,
    ...(isDev ? { maximumDiskCacheSize: 0 } : {}),
  },
};

export default nextConfig;
