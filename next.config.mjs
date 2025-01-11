/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out", // Optional: Specifies the output directory for the build
  images: {
    unoptimized: true, // Disables Next.js image optimization
  },
  trailingSlash: true, // Ensures trailing slashes for routes
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Environment variable for dynamic URL
  },
  experimental: {
    serverActions: true, // Optional: if using server actions
  },
};

export default nextConfig;


 
  
  