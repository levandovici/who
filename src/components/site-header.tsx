import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex w-full max-w-4xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-mono text-lg font-semibold tracking-tight">
          {SITE.name}
        </Link>
        <div className="ml-auto flex gap-5 text-sm text-zinc-500">
          {NAV.filter((n) => n.href !== "/").map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-zinc-900 dark:hover:text-zinc-200">
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
