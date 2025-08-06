import { withContentlayer } from "next-contentlayer2";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpile Swagger UI React https://github.com/swagger-api/swagger-ui/issues/8245
  transpilePackages: ["swagger-client", "swagger-ui-react", "@repo/ui", "@repo/components"],
  trailingSlash: false,
  // Ensure images work properly with i18n
  images: {
    deviceSizes: [375, 640, 768, 1024, 1536, 1920],
    minimumCacheTTL: 60 * 60 * 24,
    // unoptimized: true,
    formats: ["image/avif", "image/webp"],
    domains: [
      "localhost",
      "api.microlink.io",
      "api.dicebear.com",
      "img.clerk.com",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
      "images.unsplash.com",
      "plus.unsplash.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "contrib.rocks",
        pathname: "/**"
      }
    ]
  }
};

export default withContentlayer(nextConfig);
