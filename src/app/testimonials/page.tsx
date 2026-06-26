"use client";

import { useEffect, useState } from "react";
import { Check, Star, Trash2, MessageSquareQuote } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";

type Testimonial = {
  id: string;
  authorName: string;
  authorTitle?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  createdAt: string;
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({
    authorName: "",
    authorTitle: "",
    company: "",
    content: "",
    rating: 5,
    featured: true,
    approved: true,
  });

  async function load() {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setItems(data.testimonials ?? []);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ authorName: "", authorTitle: "", company: "", content: "", rating: 5, featured: true, approved: true });
    load();
  }

  async function update(id: string, data: Partial<Testimonial>) {
    await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  const pending = items.filter((t) => !t.approved).length;

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquareQuote className="h-6 w-6 text-gold" /> Testimonials
        </h1>
        <p className="text-muted text-sm mt-1">
          Manage client testimonials on the main site. {pending > 0 && (
            <span className="text-gold font-medium">{pending} awaiting approval</span>
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={create} className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-6 space-y-4">
          <h2 className="font-semibold">Add testimonial manually</h2>
          <input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            placeholder="Author name" className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2 text-sm" />
          <input value={form.authorTitle} onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
            placeholder="Title" className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2 text-sm" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Company" className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2 text-sm" />
          <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Testimonial content" rows={4} className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2 text-sm" />
          <button type="submit" className="rounded-xl bg-gold/20 px-4 py-2 text-sm text-gold hover:bg-gold/30">Publish</button>
        </form>

        <div className="space-y-4">
          {items.map((t) => (
            <div key={t.id} className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-5">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-bold">{t.authorName}</p>
                  <p className="text-xs text-muted">{[t.authorTitle, t.company].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex text-gold">{"★".repeat(t.rating)}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">&ldquo;{t.content}&rdquo;</p>
              <div className="flex flex-wrap gap-2">
                {!t.approved && (
                  <button onClick={() => update(t.id, { approved: true })}
                    className="inline-flex items-center gap-1 rounded-lg bg-life-green/20 px-3 py-1 text-xs text-life-green">
                    <Check className="h-3 w-3" /> Approve
                  </button>
                )}
                <button onClick={() => update(t.id, { featured: !t.featured })}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs ${t.featured ? "bg-gold/20 text-gold" : "bg-white/5 text-muted"}`}>
                  <Star className="h-3 w-3" /> {t.featured ? "Featured" : "Feature"}
                </button>
                <button onClick={() => remove(t.id)} className="text-xs text-muted hover:text-red-400">
                  <Trash2 className="h-3 w-3 inline" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
