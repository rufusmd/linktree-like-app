/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      outputFileTracingRoot: process.cwd(), // Ensures proper file tracing for deployments
    },
    distDir: ".vercel/output", // Ensures the build files go to the correct directory
    output: "standalone", // Required for standalone server builds (e.g., on Cloudflare Pages)
    trailingSlash: true, // Adds trailing slashes to routes, which can sometimes be required
  };
  
  module.exports = nextConfig;
  
  
  