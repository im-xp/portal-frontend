import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'simplefi.s3.us-east-2.amazonaws.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'drive.google.com',
      },
      {
        hostname: '*.dropboxusercontent.com',
      },
    ],
    // Configuración para evitar problemas con sharp en Vercel
    unoptimized: true,
  },
  // Configuración adicional para sharp
  // experimental: {
  //   forceSwcTransforms: true,
  // },
};

export default nextConfig;
