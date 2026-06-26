"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  linkLabel?: string | null;
  active: boolean;
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    link: "",
    linkLabel: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setItems(data.announcements ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", message: "", type: "info", link: "", linkLabel: "", active: true });
    setLoading(false);
    load();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Site Notifications</h1>
        <p className="text-muted text-sm mt-1">Notifications appear in Company News on the homepage and in the newsroom — not as a site-wide banner.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={create} className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-gold" /> New notification
          </h2>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5"
          />
          <textarea
            required
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message shown on the main site"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 resize-none"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5"
          >
            <option value="info">Info</option>
            <option value="news">News</option>
            <option value="alert">Alert</option>
            <option value="success">Success</option>
          </select>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="Optional link (https://...)"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gold py-2.5 font-medium text-black hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish to main site"}
          </button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-gold" />
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-gold/80">{item.type}</p>
                </div>
                <button type="button" onClick={() => remove(item.id)} className="text-muted hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggle(item.id, item.active)}
                className="mt-3 text-xs rounded-full border border-white/10 px-3 py-1 hover:border-gold/30"
              >
                {item.active ? "Active in news section — click to hide" : "Hidden — click to show"}
              </button>
            </div>
          ))}
          {!items.length && <p className="text-sm text-muted">No notifications yet.</p>}
        </div>
      </div>
    </AdminShell>
  );
}
