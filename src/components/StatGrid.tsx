import Link from "next/link";

interface Stat {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const inner = (
          <>
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            {stat.hint && <p className="text-xs text-muted mt-1">{stat.hint}</p>}
            {stat.href && (
              <p className="text-xs text-gold mt-2 opacity-80 group-hover:opacity-100">View details →</p>
            )}
          </>
        );

        if (stat.href) {
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-gold/15 bg-deep-blue/30 p-5 transition-colors hover:border-gold/40 hover:bg-gold/5"
            >
              {inner}
            </Link>
          );
        }

        return (
          <div key={stat.label} className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-5">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
