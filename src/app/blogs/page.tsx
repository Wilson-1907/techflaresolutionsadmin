"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, BookOpen } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  author: { firstName: string; lastName: string; email: string; role: string };
  createdAt: string;
  reviewNotes?: string | null;
};

export default function BlogsAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState("all");

  async function load() {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setPosts(data.posts ?? []);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);
  const pending = posts.filter((p) => p.status === "PENDING").length;

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-gold" /> Blog Moderation
        </h1>
        <p className="text-muted text-sm mt-1">
          Review and approve blog posts from clients and innovators. {pending > 0 && (
            <span className="text-gold font-medium">{pending} pending review</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${filter === f ? "bg-gold/20 text-gold" : "text-muted hover:bg-white/5"}`}
          >
            {f.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-muted">No blog posts found.</p>
        ) : filtered.map((post) => (
          <div key={post.id} className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="font-bold text-lg">{post.title}</h2>
                <p className="text-sm text-muted">
                  {post.author.firstName} {post.author.lastName} ({post.author.role}) · {post.author.email}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                post.status === "APPROVED" ? "bg-life-green/20 text-life-green" :
                post.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {post.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.status === "PENDING" && (
                <>
                  <button
                    onClick={() => updateStatus(post.id, "APPROVED")}
                    className="inline-flex items-center gap-1 rounded-lg bg-life-green/20 px-3 py-1.5 text-sm text-life-green hover:bg-life-green/30"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(post.id, "REJECTED")}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/30"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </>
              )}
              {post.status === "APPROVED" && (
                <button
                  onClick={() => updateStatus(post.id, "REJECTED")}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-400"
                >
                  <X className="h-4 w-4" /> Unpublish
                </button>
              )}
              <button
                onClick={() => remove(post.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-muted hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
