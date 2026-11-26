import { SITE_NOTICES } from "@/data/notices";
import { hiringStatus } from "@/data/hiring";

export default function NoticesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Site notices & hiring</h1>
        <p className="text-sm text-muted mt-1">
          Public site shows only these two notices. Careers currently reflects the hiring status below.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Public notices (2 only)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SITE_NOTICES.map((notice) => (
            <article
              key={notice.id}
              className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-5"
            >
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{notice.type}</p>
              <h3 className="font-bold text-lg">{notice.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{notice.message}</p>
              {notice.link ? (
                <p className="mt-3 text-xs text-muted">
                  Link: {notice.linkLabel} → {notice.link}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gold/20 bg-deep-blue/40 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Hiring status</h2>
        <p className="text-sm">
          Status:{" "}
          <strong className={hiringStatus.open ? "text-life-green" : "text-gold"}>
            {hiringStatus.open ? "Open — accepting applications" : "Closed — not hiring"}
          </strong>
        </p>
        <p className="text-sm text-muted">{hiringStatus.headline}</p>
        <p className="text-sm text-muted">{hiringStatus.body}</p>
        <p className="text-xs text-muted">{hiringStatus.nextReviewNote}</p>
      </section>
    </div>
  );
}
