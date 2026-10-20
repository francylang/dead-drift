import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Storybook is built into public/storybook (see "build" script) and served from the same deploy.
  async rewrites() {
    return [{ source: "/storybook", destination: "/storybook/index.html" }];
  },
};

export default nextConfig;
