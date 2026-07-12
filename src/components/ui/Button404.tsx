"use client";

// 404ページ専用の戻るボタン
type Button404Props = {
  title: string;
};

export default function Button404(props: Button404Props) {
  const { title } = props;

  const handleGoBack = () => {
    if (typeof window === "undefined") {
      return;
    }

    const knownRoutePrefixes = [
      "/access",
      "/attention",
      "/contact",
      "/event",
      "/greeting",
      "/help",
      "/guest",
      "/info",
      "/map",
      "/news",
      "/schedule",
      "/sponsors",
    ];

    const referrer = document.referrer;
    let shouldGoToTop = true;

    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const isSameOrigin = referrerUrl.origin === window.location.origin;
        const isKnownRoute =
          isSameOrigin &&
          (referrerUrl.pathname === "/" ||
            knownRoutePrefixes.some(
              (route) =>
                referrerUrl.pathname === route ||
                referrerUrl.pathname.startsWith(`${route}/`),
            ));

        shouldGoToTop = !isSameOrigin || !isKnownRoute;
      } catch {
        shouldGoToTop = true;
      }
    }

    if (shouldGoToTop) {
      window.location.replace("/#top");
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.replace("/#top");
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="button-gradient rounded-full border-2 border-main px-l py-s text-button text-white shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)] md:text-Pbutton"
    >
      {title}
    </button>
  );
}
