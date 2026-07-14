"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categoryItems = [
  { href: "/dev", label: "Overview" },
  { href: "/dev/layout", label: "Layout" },
  { href: "/dev/common", label: "Common" },
  { href: "/dev/pages", label: "Pages" },
] as const;

const pageItems = [
  { href: "/dev/pages/top", label: "Top" },
  { href: "/dev/pages/news", label: "News" },
  { href: "/dev/pages/map", label: "Map" },
  { href: "/dev/pages/event", label: "Event" },
  { href: "/dev/pages/contact", label: "Contact" },
] as const;

export const DevNavigation = () => {
  const pathname = usePathname();
  const isPagesSection = pathname.startsWith("/dev/pages");

  return (
    <nav aria-label="Dev pages" className="flex flex-col gap-s">
      <div className="flex flex-wrap gap-xs" role="group" aria-label="Component categories">
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
      </div>

      <div className="flex flex-col gap-ss border-l-2 border-base/20 pl-s sm:flex-row sm:items-center sm:gap-s">
        <span className="shrink-0 text-text-small font-medium text-base-dark/60">Page modules</span>
        <div className="flex flex-wrap gap-x-s gap-y-xs" role="group" aria-label="Page modules">
          {pageItems.map((item) => {
            const isCurrent = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`border-b-2 px-xs py-ss text-text-small transition-colors ${
                  isCurrent
                    ? "border-base font-medium text-base"
                    : "border-transparent text-base-dark/70 hover:border-base/30 hover:text-base"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
