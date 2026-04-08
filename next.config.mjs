/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'qron-images.undone-k.workers.dev' },
      { protocol: 'https', hostname: 'authichain.com' },
      { protocol: 'https', hostname: 'strainchain.io' },
      { protocol: 'https', hostname: 'qron.space' },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
