import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // AVIF is about a third smaller than WebP on these paintings. The source files never change
    // under the same name, so the resized copies can be kept for a long time.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Video posters / photos may come from these CDNs (see src/data/media.ts).
    remotePatterns: [
      { protocol: "https", hostname: "**.b-cdn.net" },
      { protocol: "https", hostname: "embed-ssl.wistia.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "image.bhaktiamrit.org" },
    ],
  },
};

export default nextConfig;
