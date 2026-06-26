"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/sections";
import { WorkflowSubmissionDetail } from "@/components/WorkflowSubmissionDetail";

type WorkflowSource =
  | { kind: "idea"; data: Record<string, unknown> }
  | { kind: "solution"; data: Record<string, unknown> };

type Workflow = {
  id: string;
  title: string;
  type: string;
  status: string;
  summary?: string;
  createdAt: string;
  progress?: number;
  financeTotal?: number | null;
  client?: { id: string; firstName: string; lastName: string; email: string } | null;
  department?: { id: string; name: string } | null;
  source?: WorkflowSource | null;
};

type Department = { id: string; name: string };

export default function ApprovalsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [deptPick, setDeptPick] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    Promise.all([
      fetch("/api/workflows").then((r) => r.json()),
      fetch("/api/employees").then((r) => r.json()),
    ])
      .then(([wf, emp]) => {
        setWorkflows(wf.items || []);
        setDepartments(emp.departments || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const visible = workflows.filter((w) => {
    if (filter === "pending") return ["PENDING_ADMIN", "SENT_TO_CIO", "ADMIN_APPROVED"].includes(w.status);
    if (filter === "active") return !["COMPLETED", "REJECTED", "PENDING_ADMIN"].includes(w.status);
    return true;
  });

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id);
    try {
      const res = await fetch(`/api/workflows?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.workflow) {
        setWorkflows((prev) => prev.map((w) => (w.id === id ? data.workflow : w)));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Approvals & Workflows</h1>
      <p className="text-muted mb-6">
        Manage ideas and solution requests: approve to a department (HOD prepares budget), or send to CIO/CTO when
        extra consultation is needed before assignment.
      </p>

      <div className="flex gap-2 mb-6">
        {[
          { key: "pending", label: "Pending" },
          { key: "active", label: "In progress" },
          { key: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-sm ${filter === f.key ? "bg-gold/20 text-gold" : "hover:bg-gold/10"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.length === 0 ? (
          <p className="text-muted text-sm">No workflows in this view.</p>
        ) : (
          visible.map((w) => (
            <div key={w.id} className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5 space-y-4">
              <div>
                <p className="font-bold text-lg">{w.title}</p>
                <p className="text-xs text-muted mt-1">
                  {w.type} · {w.status.replace(/_/g, " ")} · {formatDate(w.createdAt)}
                  {w.department && ` · ${w.department.name}`}
                </p>
                {w.client && (
                  <p className="text-sm mt-2">
                    Client:{" "}
                    <Link href={`/clients/${w.client.id}`} className="text-gold hover:underline">
                      {w.client.firstName} {w.client.lastName} ({w.client.email})
                    </Link>
                  </p>
                )}
              </div>

              <WorkflowSubmissionDetail source={w.source as never} summary={w.summary} />

              {typeof w.progress === "number" && w.progress > 0 && (
                <div className="max-w-xs">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${w.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted mt-1">{w.progress}% complete</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  {["PENDING_ADMIN", "SENT_TO_CIO", "ADMIN_APPROVED"].includes(w.status) && (
                    <>
                      <select
                        value={deptPick[w.id] || w.department?.id || ""}
                        onChange={(e) => setDeptPick({ ...deptPick, [w.id]: e.target.value })}
                        className="rounded-lg border border-gold/20 bg-deep-blue/60 px-2 py-1.5 text-xs"
                      >
                        <option value="">Department…</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={busy === w.id || !(deptPick[w.id] || w.department?.id)}
                        onClick={() =>
                          patch(w.id, {
                            action: "approve",
                            departmentId: deptPick[w.id] || w.department?.id,
                          })
                        }
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                        title="Assigns to department for review, audit, and HOD budget"
                      >
                        Approve → department
                      </button>
                      <button
                        type="button"
                        disabled={busy === w.id}
                        onClick={() => patch(w.id, { action: "send_to_cio" })}
                        className="rounded-lg border border-gold/30 px-3 py-1.5 text-xs text-gold disabled:opacity-50"
                        title="CIO/CTO review before department assignment"
                      >
                        Send to CIO/CTO
                      </button>
                      <button
                        type="button"
                        disabled={busy === w.id}
                        onClick={() => patch(w.id, { action: "reject" })}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {w.status === "ADMIN_APPROVED" && (deptPick[w.id] || w.department?.id) && (
                    <button
                      type="button"
                      disabled={busy === w.id}
                      onClick={() =>
                        patch(w.id, {
                          action: "assign_department",
                          departmentId: deptPick[w.id] || w.department?.id,
                        })
                      }
                      className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50"
                    >
                      Assign to department
                    </button>
                  )}

                  {w.status === "CLIENT_AGREED" && (
                    <button
                      type="button"
                      disabled={busy === w.id}
                      onClick={() => patch(w.id, { action: "record_deposit" })}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                    >
                      Record 60% deposit
                    </button>
                  )}

                  {w.status === "DEPOSIT_PAID" && (
                    <button
                      type="button"
                      disabled={busy === w.id}
                      onClick={() => patch(w.id, { action: "start_work" })}
                      className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50"
                    >
                      Start work
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
