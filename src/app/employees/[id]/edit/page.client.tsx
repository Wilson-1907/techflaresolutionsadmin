"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Employee = {
  id: string;
  workId: string;
  position: string;
  isHod: boolean;
  active: boolean;
  user: { id: string; firstName: string; lastName: string; email: string; role: string };
  department?: { id: string; name: string; code: string } | null;
};

type Department = { id: string; name: string; code: string };

export default function EditEmployeePage({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [positions, setPositions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    departmentId: "",
    isHod: false,
    role: "EMPLOYEE",
    active: true,
  });

  useEffect(() => {
    fetch(`/api/employees/${employeeId}`)
      .then((r) => r.json())
      .then((d) => {
        const e = d.employee as Employee;
        setEmployee(e);
        setPositions(d.positions || []);
        setForm({
          firstName: e.user.firstName,
          lastName: e.user.lastName,
          email: e.user.email,
          password: "",
          position: e.position,
          departmentId: e.department?.id || "",
          isHod: e.isHod,
          role: e.user.role,
          active: e.active,
        });
      })
      .finally(() => setLoading(false));

    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => setDepartments(d.departments || []));
  }, [employeeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload: Record<string, unknown> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        position: form.position,
        departmentId: form.departmentId || null,
        isHod: form.isHod,
        role: form.role,
        active: form.active,
      };
      if (form.password.trim()) payload.password = form.password;

      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage(form.active ? "Employee updated." : "Employee deactivated (fired). Portal access blocked.");
      setEmployee(data.employee);
      if (!form.active) {
        setTimeout(() => router.push("/employees"), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
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

  if (!employee) {
    return <p className="text-red-300">Employee not found.</p>;
  }

  return (
    <div className="max-w-xl">
      <Link href="/employees" className="text-sm text-gold hover:underline mb-4 inline-block">
        ← Back to employees
      </Link>
      <h1 className="text-3xl font-bold mb-1">Edit Employee</h1>
      <p className="text-muted mb-2">
        Work ID <span className="font-mono text-gold">{employee.workId}</span> — permanent (dept code + join year + number)
      </p>
      <p className="text-sm text-muted mb-8">Update promotions, department transfers, or deactivate when someone leaves.</p>

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
          <label className="block text-sm mb-1">New password (optional)</label>
          <input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current"
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">Position</label>
          <select required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm">
            {positions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm">
            <option value="">No department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm">
            <option value="EMPLOYEE">Employee</option>
            <option value="HOD">Head of Department</option>
            <option value="CIO">CIO</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isHod} onChange={(e) => setForm({ ...form, isHod: e.target.checked })} />
          Head of Department for selected department
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active (uncheck to fire / deactivate portal access)
        </label>
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-50">
          {saving ? "Saving…" : form.active ? "Save changes" : "Deactivate employee"}
        </button>
      </form>
    </div>
  );
}
