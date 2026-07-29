"use client";

import MapAccordion, { type MapAccordionItem } from "@/modules/map/ui/MapAccordion";
import { defaultMapMenuSections } from "@/modules/map/ui/MapMenu";
import MapFrame from "@/components/ui/MapFrame";
import SectionTitle from "@/components/ui/SectionTitle";

const items: MapAccordionItem[] = defaultMapMenuSections
  .filter((section) => section.id !== "overall")
  .map((section) => ({
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
  }));

export default function MapPageView() {
  return (
    <div className="bg-base pt-4l">
      <section className="flex flex-col gap-s">
        <SectionTitle title="マップ" />
        <div className="pb-5l">
          <MapFrame title="全体" type="short" />
        </div>
      </section>
      <MapAccordion items={items} />
    </div>
  );
}
