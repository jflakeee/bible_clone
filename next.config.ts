import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/bible_clone' : '',
  assetPrefix: isProd ? '/bible_clone/' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
