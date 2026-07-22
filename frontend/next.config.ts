import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['100.109.238.127'],

  output: 'standalone', 

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;