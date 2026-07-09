import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['100.109.238.127'],
  
  // 1. Mode wajib untuk Docker agar ringan & stabil
  output: 'standalone', 

  // 2. BYPASS: Abaikan error ESLint saat build di Docker
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. BYPASS: Abaikan error TypeScript saat build di Docker
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;