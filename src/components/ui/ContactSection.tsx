export type ContactSectionProps = {
  title?: string;
  body?: string;
};

export default function ContactSection({ title, body }: ContactSectionProps) {
    const corners = [ // ４つ角の配置のためのリスト
        "top-0 left-0 border-t-5 border-l-5",    // 左上
        "top-0 right-0 border-t-5 border-r-5",   // 右上
        "bottom-0 left-0 border-b-5 border-l-5", // 左下
        "bottom-0 right-0 border-b-5 border-r-5" // 右下
    ];
    return (
            <div className="relative flex flex-col gap-s w-full bg-base px-m md:px-ll py-s md:py-m border-1 border-main overflow-hidden text-secondary"> {/*企画のタイトル・本文統合要素*/}
                {corners.map((pos, index) => ( /* ４つ角を、mapを用いて配置 */
                    <div
                        key={index}
                        className={`absolute w-[30px] md:w-[40px] h-[30px] md:h-[40px] border-main ${pos}`}
                        aria-hidden="true" // 装飾なのでスクリーンリーダーからは隠す
                    />
                ))}
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
