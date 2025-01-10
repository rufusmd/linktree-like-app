import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: __dirname, // Ensures dependencies are bundled
  },
  output: "standalone",               // Standalone mode for Cloudflare
  distDir: ".vercel/output",          // Build output for Cloudflare Pages
  trailingSlash: true,                // Ensures proper static paths
};

export default nextConfig;
 
  
  