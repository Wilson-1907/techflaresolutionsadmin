export type SiteNotice = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "news" | "alert";
  link?: string;
  linkLabel?: string;
};

export const SITE_NOTICES: SiteNotice[] = [
  {
    id: "opening-soon",
    title: "We will open soon",
    message:
      "TechFlare Solutions is preparing for official opening. Follow our newsroom for the launch date and early access updates.",
    type: "news",
    link: "/newsroom",
    linkLabel: "View newsroom",
  },
  {
    id: "we-are-open",
    title: "We are open",
    message:
      "Our platforms, services, and Innovation Hub are available. Clients and innovators can register, explore products, and start a project with us today.",
    type: "success",
    link: "/contact",
    linkLabel: "Contact TechFlare Solutions",
  },
];
