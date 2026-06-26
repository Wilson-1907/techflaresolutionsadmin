import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { mainSiteFetch, getMainSiteUrl } from "@/lib/main-site";
import { getMisconfiguredBackendUrl, getPublicWebsiteUrl } from "@/lib/env";
import { Plus, ArrowRight } from "lucide-react";
import { StatGrid } from "@/components/StatGrid";
import { DashboardPendingQueue } from "@/components/DashboardPendingQueue";
import { formatDate } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) redirect("/login");

  const backendUrl = getMainSiteUrl();
  const publicSite = getPublicWebsiteUrl();
  const wrongBackendUrl = getMisconfiguredBackendUrl();
  let overview: {
    stats?: Record<string, number>;
    recentActivity?: { text: string; date: string }[];
  } = {};
  let articleCount = 0;
  let publishedCount = 0;
  let loadError = false;

  try {
    overview = await mainSiteFetch("/api/admin/data?type=overview");
    const news = await mainSiteFetch("/api/news?all=true");
    articleCount = news.articles?.length || 0;
    publishedCount = news.articles?.filter((a: { published: boolean }) => a.published).length || 0;
  } catch {
    loadError = true;
  }

  const stats = overview.stats || {};

  const quickLinks = [
    { href: "/approvals", label: "Review pending approvals" },
    { href: "/employees/new", label: "Register new employee" },
    { href: "/news/new", label: "Publish news & communications" },
    { href: "/jobs/new", label: "Add career position" },
    { href: "/catalog/new", label: "Add product to catalog" },
    { href: "/crm", label: "Review CRM leads" },
    { href: "/innovation", label: "Innovation pipeline" },
    { href: "/products", label: "Product orders" },
    { href: "/support", label: "Support tickets" },
    { href: "/analytics", label: "Full analytics" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted mt-1">
            Central control for TechFlare Solutions — API backend{" "}
            <a href={backendUrl} className="text-gold hover:underline" target="_blank" rel="noreferrer">
              {backendUrl}
            </a>
            {" · "}
            <a href={publicSite} className="text-gold/80 hover:underline" target="_blank" rel="noreferrer">
              Public site
            </a>
          </p>
        </div>
        <Link
          href="/news/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold/90"
        >
          <Plus className="h-4 w-4" /> Publish news
        </Link>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm mb-6 space-y-2">
          <p>
            Live data could not be loaded from the backend ({backendUrl}). You are signed in — check{" "}
            <strong>ADMIN_API_KEY</strong> matches Render, then refresh.
          </p>
          {wrongBackendUrl && (
            <p>
              <strong>MAIN_SITE_URL</strong> on Vercel is set to the public website ({wrongBackendUrl}). It must
              be <code className="text-gold">https://techflaresolutionsback.onrender.com</code> (the panel now
              auto-corrects this, but update Vercel to avoid confusion).
            </p>
          )}
          <p>
            <Link href="/api/logout" className="text-gold underline">
              Sign out
            </Link>{" "}
            and sign in again with your admin panel password if access seems wrong.
          </p>
        </div>
      )}

      <DashboardPendingQueue />

      <StatGrid
        stats={[
          { label: "Clients", value: stats.clients ?? 0, href: "/clients" },
          { label: "Innovators", value: stats.innovators ?? 0, href: "/innovation" },
          { label: "Ideas pending", value: stats.ideasPending ?? 0, href: "/approvals" },
          { label: "Active projects", value: stats.activeProjects ?? 0, href: "/projects" },
          { label: "Product orders", value: stats.orders ?? 0, href: "/products" },
          { label: "Open tickets", value: stats.openTickets ?? 0, href: "/support" },
          { label: "News published", value: publishedCount || stats.newsPublished || 0, href: "/news" },
          { label: "Staff", value: stats.admins ?? 0, href: "/employees" },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
          <h2 className="text-lg font-bold mb-4">Quick actions</h2>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gold/10"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
          <h2 className="text-lg font-bold mb-4">Recent activity</h2>
          <ul className="space-y-3 text-sm">
            {(overview.recentActivity || []).length === 0 ? (
              <li className="text-muted">No recent activity yet.</li>
            ) : (
              overview.recentActivity!.map((a, i) => (
                <li key={i}>
                  <p>{a.text}</p>
                  <p className="text-xs text-muted mt-0.5">{formatDate(a.date)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
