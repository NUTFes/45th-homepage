import Link from "next/link";

export default function ButtonMain(props: { href: string; title: string }) {
  const { href, title } = props;
  return (
    <div className="flex w-full justify-center pb-ss">
      <Link
        href={href}
        className="
          button-gradient rounded-full border-2 border-main px-l py-s
          text-button text-white
          shadow-[0px_6px_8px_rgba(60,224,232,0.6)]
          transition-all duration-200
          hover:-translate-y-1
          hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)]
        "
      >
        {title}
      </Link>
    </div>
  );
}