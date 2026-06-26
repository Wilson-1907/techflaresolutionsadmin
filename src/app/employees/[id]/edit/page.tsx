import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import EditEmployeePage from "./page.client";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/login");
  const { id } = await params;
  return <EditEmployeePage employeeId={id} />;
}
