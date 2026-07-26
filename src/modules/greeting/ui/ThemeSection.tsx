import Image from "next/image";

export default function ThemeSection(){
    return(
        <div className="bg-base_dark w-full text-white">
            <div className="font-kaisotai text-Ptitle px-pl py-5l flex flex-col gap-y-ss z-10">
                <div>技大祭テーマ</div>
                <div className="font-goldman">Bluem Up Date</div>
                <div className="font-sans text-Ptext">青春の中で積み重ねた努力を当日に花開かせ、技大祭をさらに進化させていくことを表現しています。</div>
            </div>
        </div>
    );
}

