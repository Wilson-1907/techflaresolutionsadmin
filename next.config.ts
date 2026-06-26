import type { NextConfig } from "next";

const DEFAULT_BACKEND_URL = "https://techflaresolutionsback.onrender.com";

function isValidBackendUrl(url: string): boolean {
  try {
    const host = new URL(url.replace(/\/$/, "")).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    return host.endsWith(".onrender.com");
  } catch {
    return false;
  }
}

function pickBackendUrl(): string {
  const candidates = [
    process.env.BACKEND_URL,
    process.env.MAIN_SITE_URL,
    process.env.NEXT_PUBLIC_MAIN_SITE_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && isValidBackendUrl(trimmed)) {
      return trimmed.replace(/\/$/, "");
    }
  }
  return DEFAULT_BACKEND_URL;
}

const backendUrl = pickBackendUrl();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_MAIN_SITE_URL: backendUrl.replace(/\/$/, ""),
  },
};

export default nextConfig;
