import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.comparaparqueaderos.com",
          },
        ],
        destination: "https://comparaparqueaderos.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;