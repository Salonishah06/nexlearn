import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's image CDN already handles resizing, cropping and format
    // negotiation (see `urlFor` calls). Serve its URLs straight to the browser
    // rather than routing them through the Next optimizer — the optimizer does a
    // server-side fetch that Next 16's SSRF guard rejects on NAT64 networks,
    // where cdn.sanity.io resolves to a 64:ff9b::/96 address.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
