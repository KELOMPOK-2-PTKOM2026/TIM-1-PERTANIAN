import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma must run in Node runtime, not bundled/symlinked by Turbopack.
  // Prevents "failed to create junction point at .next/dev/node_modules/@prisma/client-*"
  // (os error 145) on Windows.
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
