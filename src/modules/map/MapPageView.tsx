import MapFrame from "@/components/ui/MapFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import MapAccordion, { type MapAccordionItem } from "@/modules/map/ui/MapAccordion";
import MapPcSection from "@/modules/map/ui/MapPcSection";
import { defaultMapMenuSections } from "@/modules/map/ui/mapMenuData";
import SponsorAdsBoundary from "@/modules/sponsors/ui/SponsorAdsBoundary";

const items: MapAccordionItem[] = defaultMapMenuSections.flatMap((section) => {
  if (section.id === "overall") {
    return [];
  }

  return [
    {
      id: section.id,
      title: section.label,
      content: (
        <div className="-mx-4l flex flex-col gap-3l pt-3l pb-5l">
          {section.items && section.items.length > 0 ? (
            section.items.map((item) => (
              <MapFrame key={item.id} title={item.label} type={item.type} />
            ))
          ) : (
            <MapFrame title={section.label} type={section.type} />
          )}
        </div>
      ),
    },
  ];
});

export default function MapPageView() {
  return (
    <div className="bg-base">
      <div className="pt-4l md:hidden">
        <section className="flex flex-col gap-s">
          <SectionTitle title="マップ" />
          <div className="pb-5l">
            <MapFrame title="全体" type="short" />
          </div>
        </section>
        <MapAccordion items={items} />
      </div>

      <div className="hidden flex-col gap-pm pb-pm md:flex">
        <MapPcSection />
      </div>

      <div className="pb-4l">
        <SponsorAdsBoundary />
      </div>
    </div>
  );
}
