"use client";

import type { MouseEvent } from "react";

type Button404Props = {
  title: string;
};

function hasSameOriginReferrer() {
  if (!document.referrer) return false;

  try {
    return new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function Button404({ title }: Button404Props) {
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (window.history.length > 1 && hasSameOriginReferrer()) {
      window.history.back();
    } else {
      window.location.replace("/#top");
    }
  };

  return (
    <a
      href="/#top"
      onClick={handleNavigation}
      className="button-gradient flex min-h-16.5 items-center justify-center gap-x-xs rounded-full border-2 border-main px-l py-s text-button text-white shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main md:text-Pbutton"
    >
      {title}
    </a>
  );
}
