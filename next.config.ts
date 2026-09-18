import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Tren Vercel, Image Optimization nam trong goi Hobby mien phi: anh duoc
    // resize + chuyen sang AVIF/WebP va cache o edge.
    formats: ["image/avif", "image/webp"],
    // Cac be rong tuong ung breakpoint that cua giao dien (the tour 1/2/3 cot).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
