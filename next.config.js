/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const hubOrigin =
      process.env.HUB_APP_ORIGIN ||
      process.env.NEXT_PUBLIC_HUB_APP_ORIGIN ||
      "https://barber-master-hub.onrender.com";
    const base = hubOrigin.replace(/\/$/, "");
    return [
      {
        source: "/app",
        destination: `${base}/app`,
      },
      {
        source: "/app/:path*",
        destination: `${base}/app/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;