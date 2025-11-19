import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  // experimental: {
  //   ppr: true, // ✅ Enable Partial Prerendering
  // },
};

export default nextConfig;
