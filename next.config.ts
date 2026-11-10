import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Catalogue photographs are currently served from the existing Basava
    // storefront CDN. Replace with local files or an image CDN before launch.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.store.link",
        pathname: "/products/basava/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
