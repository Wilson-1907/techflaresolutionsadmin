"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProductFormValues = {
  title: string;
  tagline: string;
  description: string;
  status: string;
  imageUrl: string;
  externalUrl: string;
  featuresText: string;
  howItWorksText: string;
  sortOrder: number;
  published: boolean;
  source: string;
  innovatorName: string;
};

const defaultValues: ProductFormValues = {
  title: "",
  tagline: "",
  description: "",
  status: "in-development",
  imageUrl: "",
  externalUrl: "",
  featuresText: "",
  howItWorksText: "",
  sortOrder: 0,
  published: true,
  source: "techflare",
  innovatorName: "",
};

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(items?: string[]) {
  return (items || []).join("\n");
}

interface ProductFormProps {
  initial?: Partial<ProductFormValues> & { features?: string[]; howItWorks?: string[] };
  productId?: string;
  submitLabel?: string;
}

export function ProductForm({ initial, productId, submitLabel = "Save" }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({
    ...defaultValues,
    ...initial,
    featuresText: initial?.featuresText ?? arrayToLines(initial?.features),
    howItWorksText: initial?.howItWorksText ?? arrayToLines(initial?.howItWorks),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      tagline: form.tagline,
      description: form.description,
      status: form.status,
      imageUrl: form.imageUrl,
      externalUrl: form.externalUrl,
      features: linesToArray(form.featuresText),
      howItWorks: linesToArray(form.howItWorksText),
      sortOrder: form.sortOrder,
      published: form.published,
      source: form.source,
      innovatorName: form.source === "innovator" ? form.innovatorName : "",
    };

    const url = productId ? `/api/catalog/${productId}` : "/api/catalog";
    const method = productId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Failed to save product");
      return;
    }

    router.push("/catalog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1.5">Product name</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Tagline</label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          required
        />
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          >
            <option value="live">Ready — live on site</option>
            <option value="in-development">In the Fire — actively building</option>
            <option value="coming-soon">Coming — announced, not yet available</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Source</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          >
            <option value="techflare">TechFlare built-in product</option>
            <option value="innovator">Innovator shared product</option>
          </select>
        </div>
      </div>

      {form.source === "innovator" && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Innovator name / attribution</label>
          <input
            value={form.innovatorName}
            onChange={(e) => setForm({ ...form, innovatorName: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
            placeholder="e.g. Jane Innovator · AgriTech"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Product photo URL</label>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          placeholder="https://... or /products/your-image.png"
        />
        <p className="text-xs text-muted mt-1">Paste a hosted image URL or a path under /products on the main site.</p>
        {form.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imageUrl} alt="Preview" className="mt-3 h-32 rounded-xl object-cover border border-gold/20" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">External launch URL (optional)</label>
        <input
          value={form.externalUrl}
          onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
          placeholder="https://your-live-app.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Features (one per line)</label>
        <textarea
          value={form.featuresText}
          onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">How it works (one step per line, optional)</label>
        <textarea
          value={form.howItWorksText}
          onChange={(e) => setForm({ ...form, howItWorksText: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Sort order</label>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="h-4 w-4 accent-gold"
        />
        <span className="text-sm">Publish to main site products page</span>
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
