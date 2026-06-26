import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { mainSiteFetch } from "@/lib/main-site";

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status");
  const clientId = req.nextUrl.searchParams.get("clientId");
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (clientId) params.set("clientId", clientId);
  const qs = params.toString();
  const data = await mainSiteFetch(`/api/admin/workflows${qs ? `?${qs}` : ""}`);
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const body = await req.text();
  const data = await mainSiteFetch(`/api/admin/workflows?id=${id}`, {
    method: "PATCH",
    body,
  });
  return NextResponse.json(data);
}
