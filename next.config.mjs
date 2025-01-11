/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enables static HTML export
  distDir: "out", // Specifies the output directory
  images: {
    unoptimized: true, // Disables Next.js image optimization
  },
  trailingSlash: true, // Ensures trailing slashes for routes
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Set dynamically
  },
};

export default nextConfig;


 
  
  