/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: process.env.NODE_ENV === "production",
  async rewrites() {
    return [
      {
        // Proxy only backend API routes; keep other /api/* routes (e.g. auth callbacks)
        // available for Next.js route handlers without being forwarded.
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
