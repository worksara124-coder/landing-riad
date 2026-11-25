import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // WebP seul : l'AVIF lisse davantage les textures fines (plâtre, bois sculpté).
    formats: ["image/webp"],
    qualities: [75, 90],
  },
};

export default nextConfig;
