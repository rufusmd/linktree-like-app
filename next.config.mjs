/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' as it doesn't support API routes
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig;


 
  
  