"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getPublicWebsiteUrl } from "@/lib/env";
import { mainNav } from "@/lib/sections";

export function Sidebar() {
  const pathname = usePathname();
  const publicSite = getPublicWebsiteUrl();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-deep-blue/40 min-h-screen p-6 flex flex-col overflow-y-auto">
      <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
        <Image
          src="/logo.png"
          alt="TechFlare Solutions"
          width={96}
          height={32}
          unoptimized
          className="h-8 w-auto object-contain bg-transparent shrink-0"
        />
        <div className="min-w-0">
          <p className="text-gold text-xs font-semibold uppercase tracking-wider truncate">Admin</p>
          <h1 className="text-sm font-bold truncate">TechFlare Solutions</h1>
        </div>
      </div>

      <nav className="space-y-0.5 flex-1">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-gold/15 text-gold" : "hover:bg-gold/10 text-foreground/90"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" /> {item.label}
            </Link>
          );
        })}
        <a
          href={publicSite}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gold/10 text-muted mt-4"
        >
          <ExternalLink className="h-4 w-4" /> View main site
        </a>
      </nav>

      <button
        type="button"
        onClick={async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/login";
        }}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-red-500/10 hover:text-red-300 w-full mt-4"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}
