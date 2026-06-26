import { mainSiteFetch, getMainSiteUrl, MainSiteError } from "@/lib/main-site";
import { sectionMeta, formatDate, type SectionId } from "@/lib/sections";
import { DataTable } from "@/components/DataTable";
import { StatGrid } from "@/components/StatGrid";
import { ChangePanelPasswordForm } from "@/components/ChangePanelPasswordForm";

type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
};

type Solution = {
  problem: string;
  industry: string;
  budget: string;
  status: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string } | null;
  guestName?: string | null;
  guestEmail?: string | null;
};

type UserRow = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  company?: string | null;
  phone?: string | null;
  points?: number;
  communityMember?: boolean;
  createdAt: string;
};

type Project = {
  name: string;
  status: string;
  progress: number;
  updatedAt: string;
  client?: { firstName: string; lastName: string; company?: string | null };
  invoices?: { number: string; amount: number; status: string }[];
};

type Order = {
  productTitle: string;
  customerName: string;
  customerEmail: string;
  plan: string;
  status: string;
  createdAt: string;
};

type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type Career = {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  status: string;
  createdAt: string;
};

type Ticket = {
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
  user?: { firstName: string; lastName: string; email: string };
};

async function fetchItems(type: string, role?: string) {
  const params = new URLSearchParams({ type });
  if (role) params.set("role", role);
  const data = await mainSiteFetch(`/api/admin/data?${params}`);
  return data.items || [];
}

function personName(user?: { firstName: string; lastName: string; email: string } | null, guest?: string | null) {
  if (user) return `${user.firstName} ${user.lastName}`;
  return guest || "Guest";
}

function personEmail(user?: { email: string } | null, guest?: string | null) {
  return user?.email || guest || "—";
}

export async function AdminSectionView({ sectionId }: { sectionId: SectionId }) {
  const meta = sectionMeta[sectionId];
  let error = "";
  let content: React.ReactNode = null;

  try {
    switch (sectionId) {
      case "crm": {
        const [contacts, solutions] = await Promise.all([
          fetchItems("contacts") as Promise<Contact[]>,
          fetchItems("solutions") as Promise<Solution[]>,
        ]);
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Contact submissions", value: contacts.length },
                { label: "Solution requests", value: solutions.length },
                {
                  label: "New this week",
                  value: [...contacts, ...solutions].filter(
                    (r) => Date.now() - new Date(r.createdAt).getTime() < 7 * 86400000
                  ).length,
                },
              ]}
            />
            <h2 className="text-lg font-bold mb-3">Contact form</h2>
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "subject", label: "Subject" },
                { key: "date", label: "Date" },
              ]}
              rows={contacts.map((c) => ({
                name: c.name,
                email: c.email,
                subject: c.subject,
                date: formatDate(c.createdAt),
              }))}
              emptyMessage="No contact submissions yet."
            />
            <h2 className="text-lg font-bold mb-3 mt-8">Solution requests</h2>
            <DataTable
              columns={[
                { key: "contact", label: "Contact" },
                { key: "industry", label: "Industry" },
                { key: "budget", label: "Budget" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
              rows={solutions.map((s) => ({
                contact: personName(s.user, s.guestName),
                industry: s.industry,
                budget: s.budget,
                status: s.status.replace(/_/g, " "),
                date: formatDate(s.createdAt),
              }))}
              emptyMessage="No solution requests yet."
            />
          </>
        );
        break;
      }
      case "projects": {
        const projects = (await fetchItems("projects")) as Project[];
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Total projects", value: projects.length },
                {
                  label: "In progress",
                  value: projects.filter((p) => p.status === "IN_PROGRESS").length,
                },
                {
                  label: "Completed",
                  value: projects.filter((p) => p.status === "COMPLETED").length,
                },
              ]}
            />
            <DataTable
              columns={[
                { key: "name", label: "Project" },
                { key: "client", label: "Client" },
                { key: "status", label: "Status" },
                { key: "progress", label: "Progress" },
                { key: "updated", label: "Updated" },
              ]}
              rows={projects.map((p) => ({
                name: p.name,
                client: p.client
                  ? `${p.client.firstName} ${p.client.lastName}${p.client.company ? ` · ${p.client.company}` : ""}`
                  : "—",
                status: p.status.replace(/_/g, " "),
                progress: `${p.progress}%`,
                updated: formatDate(p.updatedAt),
              }))}
            />
          </>
        );
        break;
      }
      case "clients": {
        const clients = (await fetchItems("users", "CLIENT")) as UserRow[];
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Client accounts", value: clients.length, href: "/clients" },
                {
                  label: "With company",
                  value: clients.filter((c) => c.company).length,
                },
                {
                  label: "Total points",
                  value: clients.reduce((sum, c) => sum + (c.points || 0), 0).toFixed(0),
                },
              ]}
            />
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "company", label: "Company" },
                { key: "phone", label: "Phone" },
                { key: "points", label: "Points" },
                { key: "joined", label: "Joined" },
                { key: "actions", label: "" },
              ]}
              rows={clients.map((c) => ({
                name: `${c.firstName} ${c.lastName}`,
                email: c.email,
                company: c.company || "—",
                phone: c.phone || "—",
                points: String(c.points ?? 0),
                joined: formatDate(c.createdAt),
                actions: c.id ? (
                  <a href={`/clients/${c.id}`} className="text-gold text-xs hover:underline">
                    View details
                  </a>
                ) : (
                  "—"
                ),
              }))}
            />
          </>
        );
        break;
      }
      case "employees": {
        let staff: UserRow[] = [];
        let employeeProfiles: Array<{
          id: string;
          workId: string;
          position: string;
          active: boolean;
          department?: { name: string; code?: string } | null;
          user: { id: string; firstName: string; lastName: string; email: string; role: string };
        }> = [];
        try {
          const empRes = await mainSiteFetch("/api/admin/employees");
          employeeProfiles = empRes.employees || [];
        } catch {
          staff = (await fetchItems("users", "ADMIN,EMPLOYEE,HOD,CIO")) as UserRow[];
        }
        content = (
          <>
            <div className="mb-6">
              <a
                href="/employees/new"
                className="inline-flex rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold/90"
              >
                Register new employee
              </a>
            </div>
            <StatGrid
              stats={[
                {
                  label: "Staff accounts",
                  value: employeeProfiles.length || staff.length,
                  href: "/employees/new",
                },
                {
                  label: "HODs",
                  value: employeeProfiles.filter((e) => e.user.role === "HOD").length,
                },
                {
                  label: "Developers",
                  value: employeeProfiles.filter((e) => e.user.role === "EMPLOYEE").length,
                },
              ]}
            />
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "workId", label: "Work ID" },
                { key: "email", label: "Email" },
                { key: "position", label: "Position" },
                { key: "department", label: "Department" },
                { key: "status", label: "Status" },
                { key: "actions", label: "" },
              ]}
              rows={
                employeeProfiles.length > 0
                  ? employeeProfiles.map((e) => ({
                      name: `${e.user.firstName} ${e.user.lastName}`,
                      workId: e.workId,
                      email: e.user.email,
                      position: e.position,
                      department: e.department ? `${e.department.code || ""} ${e.department.name}`.trim() : "—",
                      status: e.active ? e.user.role : "Inactive",
                      actions: (
                        <a href={`/employees/${e.user.id}/edit`} className="text-gold text-xs hover:underline">
                          Edit
                        </a>
                      ),
                    }))
                  : staff.map((s) => ({
                      name: `${s.firstName} ${s.lastName}`,
                      workId: "—",
                      email: s.email,
                      position: "—",
                      department: "—",
                      status: s.role || "—",
                      actions: s.id ? (
                        <a href={`/employees/${s.id}/edit`} className="text-gold text-xs hover:underline">
                          Edit
                        </a>
                      ) : (
                        "—"
                      ),
                    }))
              }
            />
          </>
        );
        break;
      }
      case "innovation": {
        const ideas = (await fetchItems("ideas")) as Idea[];
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Total ideas", value: ideas.length },
                {
                  label: "Under review",
                  value: ideas.filter((i) => !["APPROVED", "REJECTED", "IN_DEVELOPMENT"].includes(i.status)).length,
                },
                {
                  label: "Approved",
                  value: ideas.filter((i) => i.status === "APPROVED" || i.status === "IN_DEVELOPMENT").length,
                },
              ]}
            />
            <div className="space-y-3">
              {ideas.length === 0 ? (
                <p className="text-muted text-sm">No innovation submissions yet.</p>
              ) : (
                ideas.map((i) => {
                  const submitter = personName(i.user);
                  const params = new URLSearchParams({
                    fromIdea: i.id,
                    title: i.title,
                    description: i.description.slice(0, 500),
                    innovator: submitter,
                  });
                  return (
                    <div
                      key={i.id}
                      className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">{i.title}</p>
                        <p className="text-xs text-muted mt-1">
                          {submitter} · {i.category} · {i.status.replace(/_/g, " ")} · {formatDate(i.createdAt)}
                        </p>
                      </div>
                      <a
                        href={`/catalog/new?${params.toString()}`}
                        className="shrink-0 rounded-xl border border-gold/30 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/10"
                      >
                        Share as product
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </>
        );
        break;
      }
      case "products": {
        const orders = (await fetchItems("orders")) as Order[];
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Total orders", value: orders.length },
                { label: "Pending", value: orders.filter((o) => o.status === "pending").length },
                { label: "Confirmed", value: orders.filter((o) => o.status === "confirmed").length },
              ]}
            />
            <DataTable
              columns={[
                { key: "product", label: "Product" },
                { key: "customer", label: "Customer" },
                { key: "email", label: "Email" },
                { key: "plan", label: "Plan" },
                { key: "status", label: "Status" },
                { key: "date", label: "Ordered" },
              ]}
              rows={orders.map((o) => ({
                product: o.productTitle,
                customer: o.customerName,
                email: o.customerEmail,
                plan: o.plan,
                status: o.status,
                date: formatDate(o.createdAt),
              }))}
            />
          </>
        );
        break;
      }
      case "support": {
        const tickets = (await fetchItems("tickets")) as Ticket[];
        content = (
          <>
            <StatGrid
              stats={[
                { label: "All tickets", value: tickets.length },
                { label: "Open", value: tickets.filter((t) => t.status === "open").length },
                { label: "High priority", value: tickets.filter((t) => t.priority === "high").length },
              ]}
            />
            <DataTable
              columns={[
                { key: "subject", label: "Subject" },
                { key: "user", label: "User" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
                { key: "updated", label: "Updated" },
              ]}
              rows={tickets.map((t) => ({
                subject: t.subject,
                user: personName(t.user),
                priority: t.priority,
                status: t.status,
                updated: formatDate(t.updatedAt),
              }))}
            />
          </>
        );
        break;
      }
      case "community": {
        const members = (await fetchItems("community")) as UserRow[];
        content = (
          <>
            <StatGrid stats={[{ label: "Community members", value: members.length }]} />
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "joined", label: "Joined community" },
              ]}
              rows={members.map((m) => ({
                name: `${m.firstName} ${m.lastName}`,
                email: m.email,
                joined: formatDate(m.createdAt),
              }))}
              emptyMessage="No community members yet."
            />
          </>
        );
        break;
      }
      case "careers": {
        const apps = (await fetchItems("careers")) as Career[];
        content = (
          <>
            <StatGrid stats={[{ label: "Applications", value: apps.length }]} />
            <DataTable
              columns={[
                { key: "name", label: "Applicant" },
                { key: "email", label: "Email" },
                { key: "position", label: "Position" },
                { key: "status", label: "Status" },
                { key: "date", label: "Applied" },
              ]}
              rows={apps.map((a) => ({
                name: a.applicantName,
                email: a.applicantEmail,
                position: a.jobTitle,
                status: a.status,
                date: formatDate(a.createdAt),
              }))}
            />
          </>
        );
        break;
      }
      case "analytics": {
        const overview = await mainSiteFetch("/api/admin/data?type=overview");
        const stats = overview.stats || {};
        content = (
          <>
            <StatGrid
              stats={[
                { label: "Clients", value: stats.clients ?? 0 },
                { label: "Innovators", value: stats.innovators ?? 0 },
                { label: "Ideas in pipeline", value: stats.ideasPending ?? 0 },
                { label: "Active projects", value: stats.activeProjects ?? 0 },
                { label: "Product orders", value: stats.orders ?? 0 },
                { label: "Open tickets", value: stats.openTickets ?? 0 },
                { label: "News published", value: stats.newsPublished ?? 0 },
                { label: "Career applications", value: stats.careers ?? 0 },
              ]}
            />
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
                <h2 className="text-lg font-bold mb-4">Innovation pipeline</h2>
                <ul className="space-y-2 text-sm">
                  {(overview.pipeline || []).map((p: { status: string; count: number }) => (
                    <li key={p.status} className="flex justify-between gap-4">
                      <span className="text-muted">{p.status.replace(/_/g, " ")}</span>
                      <span className="font-semibold">{p.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
                <h2 className="text-lg font-bold mb-4">Recent activity</h2>
                <ul className="space-y-3 text-sm">
                  {(overview.recentActivity || []).map((a: { text: string; date: string }, i: number) => (
                    <li key={i}>
                      <p>{a.text}</p>
                      <p className="text-xs text-muted mt-0.5">{formatDate(a.date)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        );
        break;
      }
      case "settings": {
        const mainSite = getMainSiteUrl();
        content = (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
              <h2 className="font-bold mb-2">Main site connection</h2>
              <p className="text-sm text-muted mb-4">
                This admin panel publishes news and reads operational data from the main TechFlare Solutions site.
              </p>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Main site URL</dt>
                  <dd className="text-gold">{mainSite}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Admin panel</dt>
                  <dd>http://localhost:3001</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Public newsroom</dt>
                  <dd>{mainSite}/newsroom</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6">
              <h2 className="font-bold mb-2">Environment variables</h2>
              <p className="text-sm text-muted mb-4">
                Set these in both <code className="text-gold">frontend/.env</code> and{" "}
                <code className="text-gold">admin-panel/.env</code>.
              </p>
              <ul className="text-sm space-y-2 text-muted list-disc list-inside">
                <li>ADMIN_API_KEY — shared secret for API calls</li>
                <li>MAIN_SITE_URL — main site base URL (admin panel)</li>
                <li>ADMIN_PANEL_PASSWORD — initial login password (change later in Settings → Security)</li>
                <li>NEXT_PUBLIC_ADMIN_PANEL_URL — main site redirect target</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6 md:col-span-2">
              <h2 className="font-bold mb-2">Panel security</h2>
              <p className="text-sm text-muted mb-4">
                Passwords are stored as secure hashes in the database. Change your admin login password here
                instead of editing environment variables. Use a strong password (8+ characters with upper,
                lower, number, and symbol).
              </p>
              <ChangePanelPasswordForm />
            </div>
            <div className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6 md:col-span-2">
              <h2 className="font-bold mb-2">Staff access</h2>
              <p className="text-sm text-muted">
                Admin and employee logins on the main site redirect here automatically. Client and innovator
                accounts stay on their portals at /portal/client and /portal/innovation.
              </p>
            </div>
          </div>
        );
        break;
      }
    }
  } catch (err) {
    if (err instanceof MainSiteError) {
      if (err.status === 401) {
        error =
          "Admin API key mismatch. Set the same ADMIN_API_KEY in frontend/.env and admin-panel/.env, then restart both apps.";
      } else if (err.status === 503) {
        error = "Backend database unavailable. Ensure the unified backend is running and DATABASE_URL (PostgreSQL) is correct.";
      } else {
        error = err.message;
      }
    } else {
      error =
        "Cannot reach the main site at port 3000. Run `npm run dev:frontend` in the frontend folder (or `npm run dev:all` from the repo root).";
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted mb-8">{meta.description}</p>
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300 text-sm">{error}</div>
      ) : (
        content
      )}
    </div>
  );
}
