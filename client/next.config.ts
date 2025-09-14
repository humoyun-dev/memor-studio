import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
  env: {
    NEXT_PUBLIC_SERVER_URL: "https://server.yupidev.uz/api/",
    // NEXT_PUBLIC_SERVER_URL: "http://localhost:8000/api/",
  },
};

export default nextConfig;
