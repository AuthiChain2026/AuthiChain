/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'qron-images.undone-k.workers.dev' },
      { protocol: 'https', hostname: 'authichain.com' },
      { protocol: 'https', hostname: 'strainchain.io' },
      { protocol: 'https', hostname: 'qron.space' },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/verify/public',
        destination: '/api/v1/verify',
      },
    ];
  },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
