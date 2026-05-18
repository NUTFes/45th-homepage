import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cssChunking: "strict",
    globalNotFound: true,
    inlineCss: true,
    optimizePackageImports: ["react-aria-components", "react-aria"],
  },
  images: {
    deviceSizes: [360, 384, 412, 430, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 75],
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/analytics/script.js",
        destination: "https://rybbit.nutfes.net/api/script.js",
      },
      {
        source: "/analytics/replay.js",
        destination: "https://rybbit.nutfes.net/api/replay.js",
      },
      {
        source: "/analytics/track",
        destination: "https://rybbit.nutfes.net/api/track",
      },
      {
        source: "/analytics/session-replay/:path*",
        destination: "https://rybbit.nutfes.net/api/session-replay/:path*",
      },
      {
        source: "/analytics/identify",
        destination: "https://rybbit.nutfes.net/api/identify",
      },
      {
        source: "/analytics/site/:path*",
        destination: "https://rybbit.nutfes.net/api/site/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/font/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icon/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ...webpackConfig.resolve.extensionAlias,
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
