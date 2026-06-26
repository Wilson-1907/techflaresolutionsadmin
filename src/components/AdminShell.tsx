import { Sidebar } from "@/components/Sidebar";
import { SessionTimeoutGuard } from "@/components/SessionTimeoutGuard";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SessionTimeoutGuard />
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
