"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: string;
  image?: string;
  published: boolean;
  source: string;
  innovatorName?: string | null;
};

const statusLabels: Record<string, string> = {
  live: "Ready",
  "in-development": "In the Fire",
  "coming-soon": "Coming",
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load products");
        setProducts([]);
        return;
      }
      setProducts(data.products || []);
    } catch {
      setError("Could not reach the backend API.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(product: Product) {
    await fetch(`/api/catalog/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !product.published }),
    });
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product from the catalog?")) return;
    await fetch(`/api/catalog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted mt-1">
            Add TechFlare products and innovator-shared products — photo, status, and details sync to the main site.
          </p>
        </div>
        <Link
          href="/catalog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-8 text-center text-muted">
          No products in catalog yet. Add your first product or run <code className="text-gold">npm run db:seed</code> on the backend.
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex gap-4 items-start">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-16 w-24 rounded-lg object-cover border border-gold/15 shrink-0"
                />
              ) : (
                <div className="h-16 w-24 rounded-lg bg-black/40 border border-gold/15 shrink-0" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs uppercase text-gold font-semibold">
                    {statusLabels[product.status] || product.status}
                  </span>
                  {product.source === "innovator" && (
                    <span className="text-xs bg-life-green/20 text-life-green px-2 py-0.5 rounded-full">
                      Innovator{product.innovatorName ? ` · ${product.innovatorName}` : ""}
                    </span>
                  )}
                  {product.published ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Live on site</span>
                  ) : (
                    <span className="text-xs bg-white/10 text-muted px-2 py-0.5 rounded-full">Draft</span>
                  )}
                </div>
                <h2 className="font-bold">{product.title}</h2>
                <p className="text-sm text-muted mt-1 line-clamp-2">{product.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublish(product)}
                className="rounded-lg border border-gold/20 p-2 hover:bg-gold/10"
                title={product.published ? "Unpublish" : "Publish"}
              >
                {product.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-green-400" />}
              </button>
              <Link href={`/catalog/${product.id}/edit`} className="rounded-lg border border-gold/20 p-2 hover:bg-gold/10">
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => deleteProduct(product.id)}
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
