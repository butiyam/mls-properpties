
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.mlsgrid.com",
      },
      {
        protocol: "https",
        hostname: "mredllc.media-cs.connectmls.com",
      },
      {
        protocol: "https",
        hostname: "media.mlsgrid.com",
      },
    ],
  },
};

export default nextConfig;

