import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/guides", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/guides/what-is-whois", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/guides/what-is-rdap", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/guides/what-is-dns", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/api-docs", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
