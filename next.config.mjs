/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "qteefmlwxyvxjvehgjvp.supabase.co",
      },
      {
        protocol: "https",
        hostname: "supabase-image-cache.citaleco.workers.dev",
      },
    ],
    domains: [
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "qteefmlwxyvxjvehgjvp.supabase.co",
      "supabase-image-cache.citaleco.workers.dev",
    ],
    formats: ["image/avif", "image/webp"], // ✅ Enable better image optimization
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
