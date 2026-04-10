import Image from "next/image";

export default function LogoInfo(){
    return(
        <div className="bg-linear-to-b from-[#FFAFA] from-7% via-[#9399C7] to-base flex flex-col  items-center justify-center w-full pt-4l pb-3l gap-ll">
            <Image src="/image/45th-logo.svg" alt="45th技大祭ロゴ" width={140} height={140} />
            <p className="text-center">
                これは説明文です。これは説明文です。これは説明文です。
                これは説明文です。これは説明文です。
                これは説明文です。これは説明文です。これは説明文です。
            </p>
        </div>
    );
}
