import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/session";
import { mainSiteFetch } from "@/lib/main-site";
import { formatDate } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/login");

  const { id } = await params;
  let detail: {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      company?: string | null;
      phone?: string | null;
      points?: number;
      createdAt: string;
    };
    workflows?: Array<{
      id: string;
      title: string;
      status: string;
      progress: number;
      financeTotal?: number | null;
      financeStages?: unknown;
      updatedAt: string;
      department?: { name: string } | null;
    }>;
    projects?: Array<{ name: string; status: string; progress: number }>;
    ideas?: Array<{ title: string; status: string }>;
    solutions?: Array<{ problem: string; status: string }>;
    error?: string;
  };

  try {
    detail = await mainSiteFetch(`/api/admin/data?type=clientDetail&id=${id}`);
  } catch {
    notFound();
  }

  if (!detail.user || detail.error) notFound();
  const { user, workflows = [], projects = [], ideas = [], solutions = [] } = detail;

  return (
    <div>
      <Link href="/clients" className="text-sm text-gold hover:underline mb-4 inline-block">
        ← All clients
      </Link>
      <h1 className="text-3xl font-bold mb-1">
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-muted mb-8">
        {user.email}
        {user.company && ` · ${user.company}`}
        {user.phone && ` · ${user.phone}`}
        · Joined {formatDate(user.createdAt)}
        · {user.points ?? 0} points
      </p>

      <h2 className="text-lg font-bold mb-4">Service workflows</h2>
      {workflows.length === 0 ? (
        <p className="text-muted text-sm mb-8">No active workflows for this client.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {workflows.map((w) => (
            <div key={w.id} className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{w.title}</p>
                  <p className="text-xs text-muted mt-1">
                    {w.status.replace(/_/g, " ")}
                    {w.department && ` · ${w.department.name}`}
                    · Updated {formatDate(w.updatedAt)}
                  </p>
                  {w.financeTotal != null && (
                    <p className="text-sm text-gold mt-2">Invoice total: ${w.financeTotal.toLocaleString()}</p>
                  )}
                </div>
                {w.progress > 0 && (
                  <div className="w-32 shrink-0">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gold" style={{ width: `${w.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted mt-1 text-right">{w.progress}%</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5">
          <h3 className="font-bold mb-3">Projects ({projects.length})</h3>
          <ul className="text-sm space-y-2">
            {projects.slice(0, 5).map((p, i) => (
              <li key={i}>{p.name} — {p.status.replace(/_/g, " ")} ({p.progress}%)</li>
            ))}
            {projects.length === 0 && <li className="text-muted">None</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5">
          <h3 className="font-bold mb-3">Ideas ({ideas.length})</h3>
          <ul className="text-sm space-y-2">
            {ideas.slice(0, 5).map((idea, i) => (
              <li key={i}>{idea.title} — {idea.status.replace(/_/g, " ")}</li>
            ))}
            {ideas.length === 0 && <li className="text-muted">None</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5">
          <h3 className="font-bold mb-3">Solutions ({solutions.length})</h3>
          <ul className="text-sm space-y-2">
            {solutions.slice(0, 5).map((s, i) => (
              <li key={i}>{s.problem.slice(0, 60)}… — {s.status}</li>
            ))}
            {solutions.length === 0 && <li className="text-muted">None</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
