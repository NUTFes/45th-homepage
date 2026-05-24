import Link from "next/link";
import Image from "next/image";


type EventFrameProps = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

const MAX_LENGTH = 24; 
const TEXTB_LENGTH = 14;

export default function EventFrame(props: EventFrameProps) {
  const { name, href, imageUrl, imageAlt } = props;

  const displayName = name.length > MAX_LENGTH ? name.slice(0, MAX_LENGTH) + "・・・" : name;
  const nameClassName =
    name.length <= TEXTB_LENGTH ? "text-textb" : "text-[14px] leading-[20px]";

  return (
    <Link
      href={href}
      className="flex flex-col  pb-s rounded-lg bg-secondary transition-all duration-200 hover:-translate-y-1 h-[200px] w-[148px] shadow-[0px_6px_8px_rgba(60,224,232,0.6)] hover:shadow-[0px_6px_8px_rgba(60,224,232,1.0)]"
    >
      <div className="relative h-[111px] w-full">
        <Image className="object-cover" src={imageUrl} alt={imageAlt} fill />
      </div>
      <div className={`flex flex-1 items-center px-s ${nameClassName}`}>{displayName}</div>
    </Link>
  );
}
