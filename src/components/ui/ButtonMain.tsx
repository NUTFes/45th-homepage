import Link from "next/link";

export default function ButtonMain(props: { href: string; title: string }) {
  const { href, title } = props;
  return (
    <div className="flex w-full justify-center pb-ss">
      {/* ↑影のぶんのパディング */}
      <Link
        href={href}
        className="button-gradient rounded-full border-2 border-main px-l py-s text-button text-white shadow-[0px_6px_8px_rgba(60,224,232,1.0)] transition-colors duration-200 hover:text-main"
      >
        {title}
      </Link>
    </div>
  );
}
