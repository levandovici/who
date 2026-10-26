"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchForm({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      className="flex w-full max-w-xl overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm focus-within:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/lookup/${encodeURIComponent(q)}`);
      }}
    >
      <input
        className="min-w-0 flex-1 px-4 py-3 font-mono text-sm outline-none dark:bg-zinc-900"
        placeholder="Enter a domain — example.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        spellCheck={false}
        autoCapitalize="off"
      />
      <button
        type="submit"
        className="bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Lookup
      </button>
    </form>
  );
}
