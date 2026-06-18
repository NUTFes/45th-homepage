export type ContactSectionProps = {
  title?: string;
  body?: string;
};

export default function ContactSection({ title, body }: ContactSectionProps) {
    return (
            <div className="relative flex flex-col gap-s w-full bg-base px-m md:px-ll py-s md:py-m border-1 border-main overflow-hidden text-secondary"> {/*企画のタイトル・本文統合要素*/}
                <div className="px-xs md:px-3l font-kaisotai"> {/*タイトル要素*/}
                    <div className=" px-s md:px-3l border-b-1 border-secondary"> {/*タイトル下のボーダー*/}
                        <p className="text-title-small md:text-title text-center">{title}</p>
                    </div>
                </div>
                <div className="md:px-s"> {/*本文要素*/}
                    <p className="font-sans text-text md:text-Ptext">{body}</p>
                </div>
            </div>
    );
}
