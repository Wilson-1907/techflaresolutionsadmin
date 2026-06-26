import { mainSiteFetch } from "@/lib/main-site";
import { PendingApprovalsQueue } from "@/components/PendingApprovalsQueue";

export async function DashboardPendingQueue() {
  try {
    const [overview, empData] = await Promise.all([
      mainSiteFetch("/api/admin/data?type=overview"),
      mainSiteFetch("/api/admin/employees"),
    ]);
    const workflows = overview.pendingApprovals?.workflows || [];
    const departments = empData.departments || [];
    return <PendingApprovalsQueue workflows={workflows} departments={departments} />;
  } catch {
    return null;
  }
}
