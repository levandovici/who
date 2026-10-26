import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-6 text-sm text-zinc-500">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="hover:text-zinc-900 dark:hover:text-zinc-200">
            {n.label}
          </Link>
        ))}
        <a href="/llms.txt" className="hover:text-zinc-900 dark:hover:text-zinc-200">llms.txt</a>
        <a href="/openapi.json" className="hover:text-zinc-900 dark:hover:text-zinc-200">openapi.json</a>
        <span className="ml-auto">&copy; {new Date().getFullYear()} {SITE.brand} &middot; Made by {SITE.author}</span>
      </div>
    </footer>
  );
}
