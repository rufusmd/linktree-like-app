/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingRoot: __dirname, // Ensures dependencies are bundled
    },
    trailingSlash: true,               // Ensures proper static paths
    distDir: ".vercel/output",         // Build output for Cloudflare Pages
    output: "standalone",              // Makes the build self-contained
};

module.exports = nextConfig;
  