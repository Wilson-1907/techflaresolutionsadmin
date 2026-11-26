"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SERVICE_CATALOG, searchCatalog, formatKes } from "@/data/service-catalog";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => searchCatalog(query), [query]);
  const categories = useMemo(
    () => Array.from(new Set(SERVICE_CATALOG.map((s) => s.category))).sort(),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service & item price catalog</h1>
        <p className="text-sm text-muted mt-1">
          Internal rates for all TechFlare services and billable items. Search by name, category, tag, or
          price. Example: simple frontend {formatKes(3000)}, occasion frontend {formatKes(5000)}.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, POS, AI, frontend, research…"
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-gold/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setQuery(cat)}
            className="rounded-full border border-gold/20 px-3 py-1 text-xs hover:bg-gold/10"
          >
            {cat}
          </button>
        ))}
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted hover:bg-white/5"
          >
            Clear
          </button>
        ) : null}
      </div>

      <p className="text-sm text-muted">
        Showing <strong className="text-foreground">{items.length}</strong> of {SERVICE_CATALOG.length}{" "}
        items
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gold/15">
        <table className="min-w-full text-sm">
          <thead className="bg-deep-blue/60 text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Service / item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Base price</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gold/10 hover:bg-gold/5">
                <td className="px-4 py-3">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted mt-1 max-w-md">{item.description}</p>
                  <p className="text-[11px] text-muted mt-1">Limits: {item.limits}</p>
                </td>
                <td className="px-4 py-3 text-muted">{item.category}</td>
                <td className="px-4 py-3 font-semibold text-gold whitespace-nowrap">
                  {formatKes(item.basePriceKes)}
                </td>
                <td className="px-4 py-3 text-muted">{item.unit}</td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">{item.typicalTimeline}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No catalog items match “{query}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
