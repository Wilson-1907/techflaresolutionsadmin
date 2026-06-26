import { NextResponse } from "next/server";
import { getAdminApiKey, getMainSiteUrl, getMisconfiguredBackendUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = getMainSiteUrl();
  const misconfiguredUrl = getMisconfiguredBackendUrl();
  let backendReachable = false;
  let adminApiKeyValid = false;
  const adminApiKeyConfigured = Boolean(process.env.ADMIN_API_KEY?.trim());

  try {
    const health = await fetch(`${backendUrl}/api/health`, { cache: "no-store" });
    backendReachable = health.ok;
  } catch {
    backendReachable = false;
  }

  try {
    const res = await fetch(`${backendUrl}/api/admin/data?type=overview`, {
      headers: { "X-Admin-Api-Key": getAdminApiKey() },
      cache: "no-store",
    });
    adminApiKeyValid = res.ok;
  } catch {
    adminApiKeyValid = false;
  }

  return NextResponse.json({
    status: "ok",
    service: "techflare-admin-panel",
    backendUrl,
    misconfiguredMainSiteUrl: misconfiguredUrl,
    backendUrlAutoCorrected: Boolean(misconfiguredUrl),
    backendReachable,
    adminApiKeyConfigured,
    adminApiKeyValid,
    timestamp: new Date().toISOString(),
    hint: !adminApiKeyValid
      ? "Set ADMIN_API_KEY on Vercel (admin panel) to the exact same value as ADMIN_API_KEY on Render. Set MAIN_SITE_URL=https://techflaresolutionsback.onrender.com (not the public www site)."
      : misconfiguredUrl
        ? `MAIN_SITE_URL is set to ${misconfiguredUrl} (public site). Update Vercel to https://techflaresolutionsback.onrender.com`
        : undefined,
  });
}
