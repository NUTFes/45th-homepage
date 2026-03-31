import * as Icons from "lucide-react";

//Icon="~"で使用したいアイコンの名前を指定　例：Icon="Camera"
//title="~"でタイトルの文字列を入力
//childrenに本文を入力（ReactNodeを使用可能）
export default function InfoBlock(props: {
  Icon: string;
  title: string;
  children: React.ReactNode;
}) {
  const { Icon, title, children } = props;
  const LucideIcon = (Icons as any)[Icon];
  return (
    <div className="flex flex-col gap-ss">
      <div className="flex w-fit items-center gap-2.5 border-b border-white px-ss pb-1">
        {LucideIcon ? (
          <LucideIcon size={28} />
        ) : (
          <Icons.HelpCircle size={28} /> //見つからない時に代わりに表示するアイコン
        )}
        <div className="color-main text-title-small">{title}</div>
      </div>
      <div className="pl-3 text-text">{children}</div>
    </div>
  );
}
