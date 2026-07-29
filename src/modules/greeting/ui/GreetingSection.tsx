import Image from "next/image";

export default type GreetingSectionProps = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  greetingTitle: string;
  greetingBody: string;
};

export default function GreetingSection({ name, imageSrc, imageAlt, greetingTitle, greetingBody }: GreetingSectionProps) {
  return (
    <div>
        <div> {/* 写真 + 名前 */}
            <Image src={imageSrc} alt={imageAlt} />
            <div>{name}</div>
        </div>
        <div> {/* 挨拶文 */}
            <h2>{greetingTitle}</h2>
            <p>{greetingBody}</p>
        </div>
    </div>
  );
}