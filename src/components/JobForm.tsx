"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type JobFormValues = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  active: boolean;
};

const defaultValues: JobFormValues = {
  title: "",
  department: "",
  location: "",
  type: "full_time",
  description: "",
  requirements: "",
  active: true,
};

interface JobFormProps {
  initial?: Partial<JobFormValues>;
  jobId?: string;
  submitLabel?: string;
}

export function JobForm({ initial, jobId, submitLabel = "Save" }: JobFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<JobFormValues>({ ...defaultValues, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = jobId ? `/api/jobs/${jobId}` : "/api/jobs";
    const method = jobId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Failed to save position");
      return;
    }

    router.push("/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1.5">Job title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Department</label>
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
        >
          <option value="full_time">Full Time</option>
          <option value="internship">Internship</option>
          <option value="graduate">Graduate Program</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Requirements</label>
        <textarea
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          required
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="h-4 w-4 accent-gold"
        />
        <span className="text-sm">Show on careers page (uncheck when position is filled)</span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-gold/20 px-6 py-3 text-sm hover:bg-gold/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
