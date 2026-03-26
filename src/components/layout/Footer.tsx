import { Facebook, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CONTACT_EMAIL = "nutfes.shikobu@gmail.com";

export default function Footer() {
	return (
		<footer className="bg-secondary px-6 py-m text-black">
			<div className="mx-auto flex w-full max-w-[393px] flex-col items-center gap-ll">
				<section aria-label="SNS" className="flex flex-col items-center gap-xs">
					<h2 className="font-kaisotai text-title font-semibold leading-[1]">FOLLOW US</h2>
					<div className="flex items-center gap-l">
						<a
							aria-label="X"
							className="font-goldman text-[54px] leading-none transition-opacity hover:opacity-70"
							href="https://x.com"
							rel="noreferrer"
							target="_blank"
						>
							X
						</a>
						<a
							aria-label="Instagram"
							className="transition-opacity hover:opacity-70"
							href="https://www.instagram.com"
							rel="noreferrer"
							target="_blank"
						>
							<Image
								alt="Instagram"
								className="size-10"
								height={40}
								src="/icon/Instagram_Glyph_Gradient.svg"
								width={40}
							/>
						</a>
						<a
							aria-label="Facebook"
							className="rounded-full text-[#1877F2] transition-opacity hover:opacity-70"
							href="https://www.facebook.com"
							rel="noreferrer"
							target="_blank"
						>
							<Facebook className="size-10" fill="currentColor" strokeWidth={1.4} />
						</a>
					</div>
				</section>

				<section className="flex w-full max-w-[272px] flex-col gap-xs text-text leading-text">
					<nav aria-label="Footer links" className="flex flex-col gap-xs">
						<Link className="w-fit underline-offset-2 hover:underline" href="#">
							アンケート
						</Link>
						<a
							className="w-fit underline-offset-2 hover:underline"
							href="https://www.nagaokaut.ac.jp/"
							rel="noreferrer"
							target="_blank"
						>
							大学ホームページ
						</a>
					</nav>

					<div className="flex flex-col gap-1">
						<h3 className="text-text">お問い合わせ</h3>
						<address className="not-italic text-[14px] leading-normal">
							<p>〒940-2188</p>
							<p>新潟県長岡市上富岡町1603-1</p>
							<p>長岡技術科学大学</p>
						</address>
						<div className="flex flex-col gap-1 text-[14px] leading-normal">
							<p className="flex items-center gap-1.5">
								<MessageCircle className="size-4 text-base-dark" strokeWidth={2.2} />
								<span>インスタDM</span>
							</p>
							<p className="flex items-center gap-1.5">
								<Mail className="size-4 text-base-dark" strokeWidth={2.2} />
								<a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
									{CONTACT_EMAIL}
								</a>
							</p>
						</div>
					</div>
				</section>

				<p className="text-center text-text leading-text">技大祭実行委員会</p>
			</div>
		</footer>
	);
}