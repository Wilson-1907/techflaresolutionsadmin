import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { mainSiteFetch } from "@/lib/main-site";

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const departmentId = req.nextUrl.searchParams.get("departmentId");
  const nextWorkId = req.nextUrl.searchParams.get("nextWorkId");
  const params = new URLSearchParams();
  if (departmentId) params.set("departmentId", departmentId);
  if (nextWorkId) params.set("nextWorkId", nextWorkId);
  const qs = params.toString();
  const data = await mainSiteFetch(`/api/admin/employees${qs ? `?${qs}` : ""}`);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.text();
    const data = await mainSiteFetch("/api/admin/employees", { method: "POST", body });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
