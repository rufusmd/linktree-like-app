/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML export
  // Remove the distDir and experimental settings
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  }
};

export default nextConfig;
 
  
  