import { AdminShell } from "@/components/AdminShell";

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
