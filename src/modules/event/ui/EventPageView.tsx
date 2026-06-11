import EventSection from "@/modules/event/ui/EventSection";
import ButtonMain from "@/components/ui/ButtonMain";
import SectionTitle from "@/components/ui/SectionTitle";

export default function EventSectionPage() {
  return (
    <section className="flex flex-col gap-s">
      <SectionTitle title="ゲスト" />
      <div className="flex justify-center">
        <ButtonMain href="/guest" title="もっと見る　＞" />
      </div>
    </section>

  );
}
