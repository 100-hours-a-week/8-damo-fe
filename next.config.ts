import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

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
    removeConsole: process.env.APP_ENV === "dev"
     ? { exclude: ["error", "warn"] }
     : false, 
  }
};

export default withSentryConfig(nextConfig, {
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
