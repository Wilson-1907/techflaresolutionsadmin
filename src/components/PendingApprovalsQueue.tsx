"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Send, XCircle, Loader2 } from "lucide-react";
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
  client?: { firstName: string; lastName: string; email: string } | null;
  department?: { name: string } | null;
  source?: WorkflowSource | null;
};

type Department = { id: string; name: string };

export function PendingApprovalsQueue({
  workflows,
  departments,
}: {
  workflows: Workflow[];
  departments: Department[];
}) {
  const [items, setItems] = useState(workflows);
  const [busy, setBusy] = useState<string | null>(null);
  const [deptPick, setDeptPick] = useState<Record<string, string>>({});

  if (items.length === 0) return null;

  async function patchWorkflow(id: string, body: Record<string, unknown>) {
    setBusy(id);
    try {
      const res = await fetch(`/api/workflows?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setItems((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-amber-200">Pending approvals</h2>
          <p className="text-sm text-muted">Approve with a department or send to CIO/CTO when extra consultation is needed.</p>
        </div>
        <Link href="/approvals" className="text-sm text-gold hover:underline shrink-0">
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {items.slice(0, 5).map((w) => (
          <div key={w.id} className="rounded-xl border border-gold/15 bg-deep-blue/40 p-4 space-y-3">
            <div>
              <p className="font-semibold">{w.title}</p>
              <p className="text-xs text-muted mt-1">
                {w.type} · {w.status.replace(/_/g, " ")} · {formatDate(w.createdAt)}
                {w.client && ` · ${w.client.firstName} ${w.client.lastName}`}
              </p>
            </div>

            <WorkflowSubmissionDetail source={w.source as never} summary={w.summary} />

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <select
                value={deptPick[w.id] || ""}
                onChange={(e) => setDeptPick({ ...deptPick, [w.id]: e.target.value })}
                className="rounded-lg border border-gold/20 bg-deep-blue/60 px-2 py-1.5 text-xs"
              >
                <option value="">Assign department…</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <button
                type="button"
                disabled={busy === w.id || !deptPick[w.id]}
                onClick={() =>
                  patchWorkflow(w.id, {
                    action: "approve",
                    departmentId: deptPick[w.id],
                    sendToCio: false,
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50"
              >
                {busy === w.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                Approve
              </button>

              <button
                type="button"
                disabled={busy === w.id}
                onClick={() => patchWorkflow(w.id, { action: "send_to_cio" })}
                className="inline-flex items-center gap-1 rounded-lg border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 disabled:opacity-50"
              >
                <Send className="h-3 w-3" /> CIO/CTO review
              </button>

              <button
                type="button"
                disabled={busy === w.id}
                onClick={() => patchWorkflow(w.id, { action: "reject" })}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
              >
                <XCircle className="h-3 w-3" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
