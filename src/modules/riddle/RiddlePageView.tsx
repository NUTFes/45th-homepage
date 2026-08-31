import MapFrame from "@/components/ui/MapFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import Image from "next/image";
import MapAccordion from "../map/ui/MapAccordion";
import Button404 from "@/components/ui/Button404";
import ButtonMain from "@/components/ui/ButtonMain";

export default function RiddlePageView() {
  const hintItems = [
    {
      id: "riddle-1",
      title: "謎1",
      content: <p>記号を文字に変えて読んでみよう</p>,
    },
    {
      id: "riddle-2",
      title: "謎2",
      content: (
        <div>
          <p>スマホで文字を打つとき、指をどう動かしているかな？</p>
          <p>「あ」のボタンを上にスライドすると、何の文字が入力される？</p>
        </div>
      ),
    },

    {
      id: "riddle-3",
      title: "謎3",
      content: <p>ブロックを押し出していくと1番下の行は「物は？」になるよ</p>,
    },

    {
      id: "riddle-4",
      title: "謎4",
      content: <p>赤線の横を縦、縦を横に変えてみよう！4文字のアルファベットが出てくるよ</p>,
    },
    {
      id: "riddle-5",
      title: "謎5",
      content: <p>五十音表に当てはめてみてね</p>,
    },

    {
      id: "riddle-6",
      title: "謎6",
      content: <p>上から順にアからンを入れてみてね</p>,
    },

    {
      id: "riddle-7",
      title: "謎7",
      content: <p>最初のイラストは「さんま」か「くま」だよ</p>,
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden bg-base py-4l sm:hidden">
        <div className="pointer-events-none absolute -top-6 -right-2 z-0 opacity-80">
          <Image
            src="/image/greeting/45th-logo-touka.svg"
            width={250}
            height={250}
            alt="技大祭ロゴ"
            className="h-auto w-[50vw] max-w-[340px] min-w-[120px]"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-y-4l">
          <div>
            <SectionTitle title="謎解き" />
            <div className="flex flex-col px-3l pt-m">
              <Image
                src="/image/riddle/riddle_hinto.png"
                width={329}
                height={165}
                alt="キャンパスに散らばった7つの謎を解いて、キーワードを完成させよう！"
                className="h-auto w-full"
              />
            </div>
            <div className="pt-ll"></div>
            <MapFrame title="謎解き" />
          </div>
          <div className="flex flex-col gap-y-m">
            <SectionTitle title="ヒント" />
            <MapAccordion items={hintItems} />
          </div>
        </div>
      </div>

      <div className="hidden min-h-screen flex-col items-center justify-center gap-y-4l bg-base px-4l text-center text-text-large font-bold text-font-main sm:flex">
        <div className="pointer-events-none absolute -top-6 -right-2 z-0 opacity-80">
          <Image
            src="/image/greeting/45th-logo-touka.svg"
            width={250}
            height={250}
            alt="技大祭ロゴ"
            className="h-auto w-[50vw] max-w-[340px] min-w-[120px]"
          />
        </div>
        このページはスマートフォンでご覧ください
        <Button404 title="Go Back" />
      </div>
    </>
  );
}
