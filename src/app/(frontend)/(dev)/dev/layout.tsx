import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/dev", label: "Overview" },
  { href: "/dev/layout", label: "Layout Components" },
  { href: "/dev/common", label: "Common Components" },
  { href: "/dev/pages", label: "Page Modules" },
] as const;

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-m px-m py-l md:flex-row md:gap-l">
      <aside className="h-fit rounded-xl border border-base/20 bg-white p-m shadow-sm md:sticky md:top-m md:w-64 md:shrink-0">
        <h2 className="mb-s text-title-small text-base-dark">Dev Navigation</h2>
        <nav className="flex flex-col gap-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-xs py-ss text-text text-base-dark transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
