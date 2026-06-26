const isBuild = process.env.NEXT_PHASE === "phase-production-build";
export const DEFAULT_BACKEND_URL = "https://techflaresolutionsback.onrender.com";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/** API calls must go to Render (or local dev), not the public marketing site. */
export function isValidBackendUrl(url: string): boolean {
  try {
    const host = new URL(normalizeUrl(url)).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    return host.endsWith(".onrender.com");
  } catch {
    return false;
  }
}

function pickBackendUrl(...candidates: (string | undefined)[]): string {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && isValidBackendUrl(trimmed)) {
      return normalizeUrl(trimmed);
    }
  }
  return DEFAULT_BACKEND_URL;
}

/** If MAIN_SITE_URL points at the marketing site by mistake, return it for diagnostics. */
export function getMisconfiguredBackendUrl(): string | null {
  const raw =
    process.env.MAIN_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAIN_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw && !isValidBackendUrl(raw)) {
    return normalizeUrl(raw);
  }
  return null;
}

/** Unified backend API base (Render). Ignores MAIN_SITE_URL when it is the public website. */
export function getMainSiteUrl(): string {
  const url = pickBackendUrl(
    process.env.BACKEND_URL,
    process.env.MAIN_SITE_URL,
    process.env.NEXT_PUBLIC_MAIN_SITE_URL,
    process.env.NEXT_PUBLIC_API_URL
  );
  if (
    !pickBackendUrl(process.env.BACKEND_URL, process.env.MAIN_SITE_URL) &&
    process.env.NODE_ENV === "production" &&
    !isBuild &&
    !isBrowser()
  ) {
    // Still returns DEFAULT_BACKEND_URL — no throw so misconfigured deploys keep working.
  }
  return url;
}

/** Public marketing website (for links in the UI — not used for API calls). */
export function getPublicWebsiteUrl(): string {
  const candidates = [
    process.env.PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL,
    process.env.MAIN_FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    getMisconfiguredBackendUrl(),
  ];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return normalizeUrl(trimmed);
  }
  return "https://www.techflare-solutions.com";
}

export function getAdminPanelSecret(): string {
  const secret = process.env.ADMIN_PANEL_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production" && !isBuild) {
    throw new Error("ADMIN_PANEL_SECRET is required in production.");
  }
  return "dev-panel-secret";
}

export function getAdminPanelPassword(): string {
  const password = process.env.ADMIN_PANEL_PASSWORD?.trim();
  if (password) return password;
  if (process.env.NODE_ENV === "production" && !isBuild) {
    throw new Error("ADMIN_PANEL_PASSWORD is required in production.");
  }
  return "admin123";
}

export function getAdminApiKey(): string {
  const key = process.env.ADMIN_API_KEY?.trim();
  if (key) return key;
  if (process.env.NODE_ENV === "production" && !isBuild) {
    throw new Error("ADMIN_API_KEY is required in production.");
  }
  return "dev-admin-api-key";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
