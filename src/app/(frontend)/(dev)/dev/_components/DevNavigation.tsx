"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categoryItems = [
  { href: "/dev", label: "Overview" },
  { href: "/dev/layout", label: "Layout" },
  { href: "/dev/common", label: "Common" },
  { href: "/dev/pages", label: "Pages" },
] as const;

export const DevNavigation = () => {
  const pathname = usePathname();
  const isPagesSection = pathname.startsWith("/dev/pages");

  return (
    <nav aria-label="Dev pages" className="flex flex-wrap gap-xs">
      {categoryItems.map((item) => {
        const isCurrent = pathname === item.href;
        const isActive = isCurrent || (item.href === "/dev/pages" && isPagesSection);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-lg border px-s py-xs text-text-small font-medium transition-colors ${
              isActive
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
