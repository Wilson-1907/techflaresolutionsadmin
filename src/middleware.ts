import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { encodeSessionCookie, verifySessionCookie } from "@/lib/session-verify";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/session";
import { isProduction } from "@/lib/env";

function secure(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (isProduction()) {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

async function attachRefreshedSession(response: NextResponse, payload: { token: string; issuedAt: number }) {
  const now = Date.now();
  const value = await encodeSessionCookie(payload.token, payload.issuedAt, now);
  response.cookies.set(getSessionCookieName(), value, getSessionCookieOptions(payload.issuedAt));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/" || pathname === "/login" || pathname === "/api/health" || pathname === "/logo.png" || pathname === "/api/logout") {
    return secure(NextResponse.next());
  }

  if (pathname.startsWith("/api/login")) {
    return secure(NextResponse.next());
  }

  const session = req.cookies.get(getSessionCookieName())?.value;
  const payload = await verifySessionCookie(session);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return secure(NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 }));
    }
    const login = new URL("/login", req.url);
    login.searchParams.set("reason", "expired");
    return secure(NextResponse.redirect(login));
  }

  const response = secure(NextResponse.next());
  await attachRefreshedSession(response, payload);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};
