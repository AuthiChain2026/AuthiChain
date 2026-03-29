/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
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
    ]
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  turbopack: {},
  webpack: (config, { isServer, dev }) => {
    // Optimize webpack cache serialization to prevent large string warnings
    if (config.cache && typeof config.cache === 'object' && config.cache.type === 'filesystem') {
      config.cache = {
        ...config.cache,
        compression: 'gzip',
        // Bump version to bust stale Vercel build cache entries
        version: `${config.cache.version || ''}+bust20260321`,
        buildDependencies: config.cache.buildDependencies || {},
      }

      if (config.cache.store === 'pack') {
        config.cache.maxMemoryGenerations = dev ? 5 : Infinity
      }
    }

    // Configure infrastructure logging to reduce noise
    // Suppress webpack cache serialization warnings (performance suggestions only)
    // while keeping important build errors visible
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
      debug: false,
    }

    return config
  },
}

module.exports = nextConfig
