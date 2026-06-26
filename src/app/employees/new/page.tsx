import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import NewEmployeePage from "./page.client";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAuthenticated())) redirect("/login");
  return <NewEmployeePage />;
}
