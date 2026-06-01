"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type HeaderDropdownItem = {
  label: string;
  href: string;
};

type HeaderDropdownProps = {
  label: string;
  items: HeaderDropdownItem[];
};

export default function HeaderDropdown({ label, items }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownId = useId();

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }}
      className="relative flex h-(--header-height) items-center"
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        className={`rounded-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main ${
          isOpen ? "text-base" : "text-base-dark hover:text-base"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>

      <div
        id={dropdownId}
        aria-hidden={!isOpen}
        className={`absolute top-full left-1/2 z-250 w-[206px] -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-[0_0_12px_0] shadow-base-shadow transition-[max-height,opacity,transform,visibility] duration-300 ease-in-out ${
          isOpen
            ? "visible max-h-100 translate-y-0 opacity-100"
            : "invisible max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <ul className="py-0">
          {items.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block px-[40px] py-xs text-left text-text-large text-base-dark transition-colors duration-200 hover:bg-base-dark hover:text-font-main focus-visible:bg-base-dark focus-visible:text-font-main focus-visible:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="block px-[40px] py-xs text-left text-text-large text-base-dark transition-colors duration-200 hover:bg-base-dark hover:text-font-main">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
