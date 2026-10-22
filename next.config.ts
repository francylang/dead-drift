import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      // Storybook is built into public/storybook (see "build" script). Its files load by relative
      // path, so it must be served from /storybook/index.html, not /storybook.
      { source: "/storybook", destination: "/storybook/index.html", permanent: false },
      // The app was called Hatch; keep old links working.
      { source: "/hatch", destination: "/dead-drift", permanent: true },
      { source: "/hatch/river", destination: "/plan", permanent: true },
    ];
  },
};

export default nextConfig;