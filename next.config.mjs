/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: emits a self-contained `out/` of HTML/CSS/JS that can be
  // hosted on any static host (Cloudflare Pages, Netlify, GoDaddy, S3, …).
  // Every Semitree route is static, so no server is required.
  output: "export",
  // Emit /path/index.html so clean URLs work on plain static file servers.
  trailingSlash: true,
  // No next/image is used; keep this so export never needs an image server.
  images: { unoptimized: true },
};

export default nextConfig;
