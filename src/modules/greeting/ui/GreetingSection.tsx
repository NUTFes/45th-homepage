import Image from "next/image";

export default function GreetingSection() {
  return (
    <div>
        <div> {/* 写真 + 名前 */}
            <Image/>
            <div></div>
        </div>
        <div> {/* 挨拶文 */}
        </div>
    </div>
  );
}