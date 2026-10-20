import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Storybook is built into public/storybook (see "build" script) and served from the same deploy.
  async rewrites() {
    return [{ source: "/storybook", destination: "/storybook/index.html" }];
  },
  // The app was called Hatch; keep old links working.
  async redirects() {
    return [
      { source: "/hatch", destination: "/dead-drift", permanent: true },
      { source: "/hatch/river", destination: "/plan", permanent: true },
    ];
  },
};

export default nextConfig;
