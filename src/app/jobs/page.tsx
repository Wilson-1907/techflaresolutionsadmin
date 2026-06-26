"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  active: boolean;
};

const typeLabels: Record<string, string> = {
  full_time: "Full Time",
  internship: "Internship",
  graduate: "Graduate",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load positions");
        setJobs([]);
        return;
      }
      setJobs(data.jobs || []);
    } catch {
      setError("Could not reach the backend API.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(job: Job) {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !job.active }),
    });
    load();
  }

  async function deleteJob(id: string) {
    if (!confirm("Remove this position permanently?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Career Positions</h1>
          <p className="text-muted mt-1">
            Manage open roles on the careers page. Uncheck or remove positions when filled.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus className="h-4 w-4" /> New position
        </Link>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-8 text-center text-muted">
          No positions yet. Add your first role or run <code className="text-gold">npm run db:seed</code> on the backend.
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase text-gold font-semibold">{job.department}</span>
                {job.active ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Open</span>
                ) : (
                  <span className="text-xs bg-white/10 text-muted px-2 py-0.5 rounded-full">Filled / Hidden</span>
                )}
              </div>
              <h2 className="font-bold">{job.title}</h2>
              <p className="text-sm text-muted mt-1">
                {job.location} · {typeLabels[job.type] || job.type}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(job)}
                className="rounded-lg border border-gold/20 p-2 hover:bg-gold/10"
                title={job.active ? "Mark as filled (hide)" : "Re-open position"}
              >
                {job.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-green-400" />}
              </button>
              <Link href={`/jobs/${job.id}/edit`} className="rounded-lg border border-gold/20 p-2 hover:bg-gold/10">
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => deleteJob(job.id)}
                className="rounded-lg border border-red-500/30 p-2 hover:bg-red-500/10 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
