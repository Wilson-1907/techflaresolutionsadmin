"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { STAFF_TIERS, type StaffTier } from "@/lib/company-positions";

type Department = { id: string; name: string; code: string; slug?: string };

export default function NewEmployeePage() {
  const router = useRouter();
  const [positions, setPositions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nextWorkId, setNextWorkId] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    departmentId: "",
    staffTier: "" as StaffTier | "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setDepartments(d.departments || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!form.departmentId) {
      setNextWorkId("");
      return;
    }
    fetch(`/api/employees?departmentId=${form.departmentId}&nextWorkId=true`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setNextWorkId(d?.nextWorkId || ""))
      .catch(() => setNextWorkId(""));
  }, [form.departmentId]);

  useEffect(() => {
    if (!form.departmentId || !form.staffTier) {
      setPositions([]);
      return;
    }
    fetch(`/api/employees?departmentId=${form.departmentId}&staffTier=${form.staffTier}`)
      .then((r) => (r.ok ? r.json() : { positions: [] }))
      .then((d) => {
        setPositions(d.positions || []);
        setForm((f) => ({ ...f, position: "" }));
      })
      .catch(() => setPositions([]));
  }, [form.departmentId, form.staffTier]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.departmentId) {
      setError("Select a department first.");
      return;
    }
    if (!form.staffTier) {
      setError("Select staff level: Staff/Developer, HOD, or Executive.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          isHod: form.staffTier === "hod",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMessage(`Employee registered. Work ID: ${data.profile?.workId || data.user?.workId}`);
      setTimeout(() => router.push("/employees"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSaving(false);
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
    <div className="max-w-xl">
      <Link href="/employees" className="text-sm text-gold hover:underline mb-4 inline-block">
        ← Back to employees
      </Link>
      <h1 className="text-3xl font-bold mb-2">Register Employee</h1>
      <p className="text-muted mb-8">
        Select department, then staff level, then the position for that department. Work ID:{" "}
        <span className="font-mono text-gold">DEPT + YY + NNN</span> (e.g. AI26001).
      </p>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 mb-4">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200 mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First name</label>
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Last name</label>
            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Department <span className="text-gold">*</span></label>
          <select
            required
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value, staffTier: "", position: "" })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm"
          >
            <option value="">Select department…</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
            ))}
          </select>
        </div>

        {form.departmentId && (
          <div>
            <label className="block text-sm mb-1">Staff level <span className="text-gold">*</span></label>
            <select
              required
              value={form.staffTier}
              onChange={(e) => setForm({ ...form, staffTier: e.target.value as StaffTier, position: "" })}
              className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm"
            >
              <option value="">Select level…</option>
              {STAFF_TIERS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {form.staffTier && (
              <p className="text-xs text-muted mt-1">
                {STAFF_TIERS.find((t) => t.id === form.staffTier)?.description}
              </p>
            )}
          </div>
        )}

        {nextWorkId && (
          <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3">
            <p className="text-xs text-muted">Next Work ID</p>
            <p className="text-xl font-bold font-mono text-gold">{nextWorkId}</p>
          </div>
        )}

        {form.staffTier && (
          <div>
            <label className="block text-sm mb-1">Position <span className="text-gold">*</span></label>
            <select
              required
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm"
              disabled={positions.length === 0}
            >
              <option value="">{positions.length ? "Select position…" : "Loading positions…"}</option>
              {positions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="text-xs text-muted mt-1">Only roles for this department and level are listed.</p>
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-50">
          {saving ? "Registering…" : "Register employee"}
        </button>
      </form>
    </div>
  );
}
