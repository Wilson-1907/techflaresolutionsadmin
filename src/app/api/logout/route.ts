import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

async function signOut() {
  await clearSession();
}

export async function GET(req: NextRequest) {
  await signOut();
  return NextResponse.redirect(new URL("/login", req.url));
}

export async function POST() {
  await signOut();
  return NextResponse.json({ ok: true });
}
