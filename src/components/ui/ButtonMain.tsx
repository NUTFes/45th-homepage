import Link from "next/link";
import { ChevronRight } from 'lucide-react';

type ButtonMainProps = {
  href: string;
  title: string;
  allow?:boolean;
};

export default function ButtonMain(props: ButtonMainProps) {
  const { href, title, allow = true } = props;

  return (
    <Link
      href={href}
      className="min-h-16.5 flex justify-center items-center gap-x-xs button-gradient rounded-full border-2 border-main px-l py-s text-button text-white shadow-[0px_6px_8px_rgba(60,224,232,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)] md:text-Pbutton"
    >
      {title}
      {allow && <ChevronRight className="size-5" />}
        

    </Link>
  );
}
