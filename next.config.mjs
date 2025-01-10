import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  output: "standalone",
  // Remove the distDir configuration temporarily
  // distDir: ".vercel/output",
  trailingSlash: true,
};

export default nextConfig;
 
  
  