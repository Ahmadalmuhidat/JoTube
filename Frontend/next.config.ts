import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  },
  /* config options here */
};

export default nextConfig;
