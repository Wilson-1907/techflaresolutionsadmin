const BUDGET_LABELS: Record<string, string> = {
  "under-500k": "Under KES 500,000",
  "500k-2m": "KES 500,000 – 2M",
  "2m-10m": "KES 2M – 10M",
  "10m-plus": "KES 10M+",
  discuss: "Let's discuss",
};

const TIMELINE_LABELS: Record<string, string> = {
  urgent: "Urgent (under 1 month)",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-plus": "6+ months",
  flexible: "Flexible",
};

type IdeaSource = {
  kind: "idea";
  data: {
    title: string;
    description: string;
    category: string;
    type: string;
    status: string;
    createdAt: string;
    user?: { firstName: string; lastName: string; email: string; role: string };
  };
};

type SolutionSource = {
  kind: "solution";
  data: {
    problem: string;
    industry: string;
    budget: string;
    timeline: string;
    status: string;
    createdAt: string;
    guestName?: string | null;
    guestEmail?: string | null;
    user?: { firstName: string; lastName: string; email: string; company?: string | null };
  };
};

export function WorkflowSubmissionDetail({
  source,
  summary,
}: {
  source: IdeaSource | SolutionSource | null | undefined;
  summary?: string;
}) {
  const text = summary?.trim();

  if (source?.kind === "idea") {
    const d = source.data;
    return (
      <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 text-sm space-y-4">
        <p className="text-sm font-bold uppercase tracking-wider text-gold">What the innovator submitted — read before approving</p>
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div><dt className="text-muted mb-0.5">Type</dt><dd className="font-medium capitalize">{d.type.replace(/_/g, " ")}</dd></div>
          <div><dt className="text-muted mb-0.5">Category</dt><dd className="font-medium capitalize">{d.category.replace(/-/g, " ")}</dd></div>
          <div><dt className="text-muted mb-0.5">Idea status</dt><dd className="font-medium">{d.status.replace(/_/g, " ")}</dd></div>
          {d.user && (
            <div><dt className="text-muted mb-0.5">Submitted by</dt><dd className="font-medium">{d.user.firstName} {d.user.lastName}</dd></div>
          )}
        </dl>
        <div>
          <p className="text-muted text-xs mb-1">Title</p>
          <p className="font-semibold text-base">{d.title}</p>
        </div>
        <div>
          <p className="text-muted text-xs mb-1">Description</p>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{d.description}</p>
        </div>
      </div>
    );
  }

  if (source?.kind === "solution") {
    const d = source.data;
    const submitter = d.user
      ? `${d.user.firstName} ${d.user.lastName}${d.user.company ? ` · ${d.user.company}` : ""}`
      : d.guestName || d.guestEmail || "Guest";

    return (
      <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 text-sm space-y-4">
        <p className="text-sm font-bold uppercase tracking-wider text-gold">What the client requested — read before approving</p>
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div><dt className="text-muted mb-0.5">Industry</dt><dd className="font-medium capitalize">{d.industry.replace(/-/g, " ")}</dd></div>
          <div><dt className="text-muted mb-0.5">Budget</dt><dd className="font-medium">{BUDGET_LABELS[d.budget] || d.budget}</dd></div>
          <div><dt className="text-muted mb-0.5">Timeline</dt><dd className="font-medium">{TIMELINE_LABELS[d.timeline] || d.timeline}</dd></div>
          <div><dt className="text-muted mb-0.5">Client</dt><dd className="font-medium">{submitter}</dd></div>
        </dl>
        <div>
          <p className="text-muted text-xs mb-1">What they need</p>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{d.problem}</p>
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 text-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-gold mb-3">Submission details — read before approving</p>
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">{text}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-white/20 bg-black/20 p-4 text-sm text-muted">
      No submission text on file. Ask the client to resubmit with a clear, complete description.
    </div>
  );
}
