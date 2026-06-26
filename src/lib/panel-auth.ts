import {
  getAdminApiKey,
  getAdminPanelPassword,
  getMainSiteUrl,
  isProduction,
} from "@/lib/env";

async function backendVerify(password: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(`${getMainSiteUrl()}/api/panel-auth/admin/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Api-Key": getAdminApiKey(),
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status };
}

async function backendSeed(password: string): Promise<void> {
  await fetch(`${getMainSiteUrl()}/api/panel-auth/admin/seed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Api-Key": getAdminApiKey(),
    },
    body: JSON.stringify({ password }),
    cache: "no-store",
  }).catch(() => undefined);
}

export async function verifyAdminLoginPassword(password: string): Promise<boolean> {
  let backendReachable = false;

  try {
    const result = await backendVerify(password);
    backendReachable = result.status > 0;
    if (result.ok) return true;
    if (result.status === 401) return false;
  } catch {
    backendReachable = false;
  }

  if (isProduction()) {
    if (!backendReachable) {
      throw new Error(
        "Cannot reach the Render backend to verify your password. Set MAIN_SITE_URL=https://techflaresolutionsback.onrender.com on Vercel."
      );
    }
    return false;
  }

  if (password === getAdminPanelPassword()) {
    await backendSeed(password);
    return true;
  }

  return false;
}
