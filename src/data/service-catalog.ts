export type CatalogService = {
  id: string;
  name: string;
  category: string;
  description: string;
  limits: string;
  basePriceKes: number;
  unit: string;
  typicalTimeline: string;
  tags: string[];
};

/** Internal price catalog — mirror of main site billable services & items (KES). */
export const SERVICE_CATALOG: CatalogService[] = [
  {
    id: "frontend-simple",
    name: "Simple frontend",
    category: "Web Development",
    description: "Clean single-page or light multi-section frontend — brand intro, CTA, contact.",
    limits: "Up to 4 sections, basic animations, 1 revision round.",
    basePriceKes: 3000,
    unit: "project",
    typicalTimeline: "1–2 days",
    tags: ["frontend", "simple", "landing", "3k"],
  },
  {
    id: "frontend-occasion",
    name: "Occasion frontend",
    category: "Web Development",
    description: "Celebration / occasion site — birthday, wedding, event invite with gallery.",
    limits: "Up to 6 sections, photo gallery, music optional, 1 revision round.",
    basePriceKes: 5000,
    unit: "project",
    typicalTimeline: "2–3 days",
    tags: ["frontend", "occasion", "birthday", "5k"],
  },
  {
    id: "web-simple",
    name: "Simple website (landing / brochure)",
    category: "Web Development",
    description: "Small multi-section marketing site with photos and basic motion.",
    limits: "Up to 5 pages, 10 images, no user accounts, 1 revision round.",
    basePriceKes: 8000,
    unit: "project",
    typicalTimeline: "3–5 days",
    tags: ["website", "landing"],
  },
  {
    id: "web-custom",
    name: "Custom business website",
    category: "Web Development",
    description: "Responsive site with contact forms, service pages, and brand styling.",
    limits: "Up to 12 pages, CMS-ready structure, 2 revision rounds.",
    basePriceKes: 35000,
    unit: "project",
    typicalTimeline: "1–2 weeks",
    tags: ["website", "business"],
  },
  {
    id: "web-ecommerce",
    name: "E-commerce / online shop",
    category: "Web Development",
    description: "Product catalog, cart, M-Pesa checkout integration.",
    limits: "Up to 50 products at launch, 1 payment gateway.",
    basePriceKes: 85000,
    unit: "project",
    typicalTimeline: "3–4 weeks",
    tags: ["ecommerce", "shop"],
  },
  {
    id: "pos-setup",
    name: "TechFlare POS setup",
    category: "Products",
    description: "Point-of-sale onboarding — catalog, checkout, receipts, staff roles.",
    limits: "1 outlet at launch, training, 14-day support.",
    basePriceKes: 45000,
    unit: "setup",
    typicalTimeline: "1–2 weeks",
    tags: ["pos", "retail"],
  },
  {
    id: "deploy-hosting",
    name: "Deployment & hosting setup",
    category: "Cloud & DevOps",
    description: "Deploy, domain DNS, SSL, basic monitoring.",
    limits: "1 environment, 30-day setup support.",
    basePriceKes: 1000,
    unit: "deployment",
    typicalTimeline: "24 hours",
    tags: ["deploy", "hosting"],
  },
  {
    id: "mpesa-integration",
    name: "M-Pesa Daraja integration",
    category: "Payments",
    description: "STK Push, QR pay, till/C2B webhooks.",
    limits: "1 till or paybill, sandbox + production.",
    basePriceKes: 15000,
    unit: "integration",
    typicalTimeline: "3–5 days",
    tags: ["mpesa", "payment"],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX design package",
    category: "Design",
    description: "Wireframes, mockups, design system.",
    limits: "Up to 8 screens, 1 revision, Figma handoff.",
    basePriceKes: 12000,
    unit: "package",
    typicalTimeline: "4–6 days",
    tags: ["design", "ui", "ux"],
  },
  {
    id: "ai-chatbot",
    name: "AI assistant / chatbot",
    category: "AI Solutions",
    description: "Chatbot trained on FAQs and services.",
    limits: "Up to 500 knowledge chunks, 1 web channel.",
    basePriceKes: 25000,
    unit: "bot",
    typicalTimeline: "1 week",
    tags: ["ai", "chatbot"],
  },
  {
    id: "automation-workflow",
    name: "Business process automation",
    category: "AI Solutions",
    description: "Automate forms, alerts, approvals, notifications.",
    limits: "Up to 3 workflows, 1 integration.",
    basePriceKes: 40000,
    unit: "project",
    typicalTimeline: "1–2 weeks",
    tags: ["automation", "workflow"],
  },
  {
    id: "mobile-app-mvp",
    name: "Mobile app MVP",
    category: "Software Engineering",
    description: "Cross-platform or Android MVP with core flows.",
    limits: "Up to 6 screens, 1 API backend.",
    basePriceKes: 120000,
    unit: "project",
    typicalTimeline: "4–6 weeks",
    tags: ["mobile", "app", "software"],
  },
  {
    id: "api-backend",
    name: "API / backend development",
    category: "Software Engineering",
    description: "REST API, database, auth, admin endpoints.",
    limits: "Up to 15 endpoints, documentation.",
    basePriceKes: 45000,
    unit: "project",
    typicalTimeline: "2–3 weeks",
    tags: ["api", "backend", "software"],
  },
  {
    id: "research-sprint",
    name: "Research & feasibility sprint",
    category: "Research",
    description: "Problem research, market scan, feasibility memo.",
    limits: "1 problem space, written report, 1 review call.",
    basePriceKes: 20000,
    unit: "sprint",
    typicalTimeline: "5–7 days",
    tags: ["research", "idea"],
  },
  {
    id: "cyber-audit-basic",
    name: "Cybersecurity review (basic)",
    category: "Cyber Security",
    description: "Vulnerability scan, config review, report.",
    limits: "1 web app or server, remote only.",
    basePriceKes: 18000,
    unit: "audit",
    typicalTimeline: "3–5 days",
    tags: ["security", "cyber"],
  },
  {
    id: "cloud-migration",
    name: "Cloud setup & migration",
    category: "Cloud & DevOps",
    description: "Cloud or managed hosting migration.",
    limits: "1 workload, rollback plan, 14-day hypercare.",
    basePriceKes: 55000,
    unit: "migration",
    typicalTimeline: "1–2 weeks",
    tags: ["cloud", "devops"],
  },
  {
    id: "iot-prototype",
    name: "IoT prototype",
    category: "IoT",
    description: "Sensor integration, dashboard, alerts.",
    limits: "Up to 3 device types, 1 dashboard.",
    basePriceKes: 75000,
    unit: "prototype",
    typicalTimeline: "2–3 weeks",
    tags: ["iot", "hardware"],
  },
  {
    id: "content-media",
    name: "Media & content package",
    category: "Creative",
    description: "Photo slider, audio, gallery sections.",
    limits: "Up to 20 assets, optimization included.",
    basePriceKes: 3000,
    unit: "package",
    typicalTimeline: "1–2 days",
    tags: ["media", "gallery"],
  },
  {
    id: "maintenance-monthly",
    name: "Monthly maintenance & support",
    category: "Support",
    description: "Updates, backups, minor fixes, monitoring.",
    limits: "4 hours/month, business hours.",
    basePriceKes: 8000,
    unit: "month",
    typicalTimeline: "ongoing",
    tags: ["support", "maintenance"],
  },
  {
    id: "consulting-hour",
    name: "Technical consulting",
    category: "Consulting",
    description: "Architecture, scoping, or code review.",
    limits: "1 hour call + written summary.",
    basePriceKes: 5000,
    unit: "hour",
    typicalTimeline: "scheduled",
    tags: ["consulting", "technology"],
  },
];

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return SERVICE_CATALOG;
  return SERVICE_CATALOG.filter((s) => {
    const hay = [s.name, s.category, s.description, s.limits, ...s.tags, String(s.basePriceKes)]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
