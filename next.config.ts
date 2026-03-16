import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3susamqetme5j.cloudfront.net',
        pathname: '/s3/images/**',
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.APP_ENV === 'dev' ? false : { exclude: ['error', 'warn'] },
  },
};

const sentryWrappedConfig = withSentryConfig(nextConfig, {
  org: 'damo-dev',
  project: 'damo-dev-fe',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

export default withSerwist(bundleAnalyzer(sentryWrappedConfig));
