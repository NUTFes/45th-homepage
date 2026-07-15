import Link from "next/link";
import { ChevronRight } from "lucide-react";

type ButtonMainProps = {
  href: string;
  title: string;
  arrow?: boolean;
};

export default function ButtonMain(props: ButtonMainProps) {
  const { href, title, arrow = true } = props;

  return (
    <Link
      href={href}
      className="button-gradient flex min-h-16.5 items-center justify-center gap-x-xs rounded-full border-2 border-main px-l py-s text-button text-white shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main md:text-Pbutton"
    >
      {title}
      {arrow && <ChevronRight className="size-5" />}
    </Link>
  );
}
