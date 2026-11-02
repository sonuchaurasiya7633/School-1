/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['lucide-react'],
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server', 'bcryptjs'],
  },
};

export default nextConfig;
