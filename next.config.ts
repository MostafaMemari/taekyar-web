import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["svg-captcha"],
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/sitemap.xml", destination: "/sitemap-index" }],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: process.env.R2_PUBLIC_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
