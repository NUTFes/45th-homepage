"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dev", label: "Overview" },
  { href: "/dev/layout", label: "Layout" },
  { href: "/dev/common", label: "Common" },
  { href: "/dev/pages", label: "Pages" },
  { href: "/dev/pages/top", label: "Top" },
  { href: "/dev/pages/news", label: "News" },
  { href: "/dev/pages/map", label: "Map" },
  { href: "/dev/pages/event", label: "Event" },
  { href: "/dev/pages/contact", label: "Contact" },
] as const;

export const DevNavigation = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Dev pages" className="flex flex-wrap gap-xs">
      {navItems.map((item) => {
        const isCurrent = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full border px-s py-xs text-text-small transition-colors ${
              isCurrent
                ? "border-base bg-base text-white"
                : "border-base/20 bg-white text-base-dark hover:bg-secondary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
