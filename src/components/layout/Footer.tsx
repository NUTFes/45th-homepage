import { Mail, MessageCircleMore } from "lucide-react";
import Image from "next/image";

export default function Footer() {
	return (
		<footer className="bg-secondary px-m py-m text-black">
			<div className="mx-auto flex w-full max-w-[393px] flex-col items-center gap-ll">
				<section aria-label="SNS" className="flex flex-col items-center gap-xs">
					<h2 className="font-kaisotai text-title font-semibold leading-[1]">FOLLOW US</h2>
					<Image
						alt="Instagram"
						className="size-10"
						height={40}
						src="/icon/Instagram_Glyph_Gradient.svg"
						width={40}
					/>
				</section>

				<section className="flex w-full max-w-[272px] flex-col gap-xs text-text leading-text">
					<div className="flex flex-col gap-xs">
						<p>アンケート</p>
						<p>大学ホームページ</p>
					</div>

					<div className="flex flex-col gap-ss">
						<h3 className="text-text">お問い合わせ</h3>
						<address className="pl-xs not-italic text-[14px] leading-[17px]">
							<p>〒940-2188</p>
							<p>新潟県長岡市上富岡町1603-1</p>
							<p>長岡技術科学大学</p>
						</address>
						<div className="flex flex-col gap-1 text-[14px] leading-[17px]">
							<p className="flex items-center gap-1.5">
								<MessageCircleMore
									className="size-4"
									fill="var(--color-base-dark)"
									stroke="#ffffff"
									strokeWidth={2.2}
								/>
								<span>インスタDM</span>
							</p>
							<p className="flex items-center gap-1.5">
								<Mail className="size-4 text-base-dark" strokeWidth={2.2} />
								<span className="underline">nutfes.shikobu@gmail.com</span>
							</p>
						</div>
					</div>
				</section>

        <p className="text-center text-text leading-text">技大祭実行委員会</p>
      </div>
    </footer>
  );
}
