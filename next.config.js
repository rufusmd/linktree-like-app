/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      outputFileTracingRoot: process.cwd(),
    },
    distDir: ".vercel/output", // Ensures Next.js builds files into the .vercel directory
    output: "standalone",     // Required for Cloudflare Pages deployments
  };
  
  module.exports = nextConfig;
  