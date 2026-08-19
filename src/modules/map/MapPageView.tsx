import Image from "next/image";

import MapFrame from "@/components/ui/MapFrame";
import SectionTitle from "@/components/ui/SectionTitle";
import MapAccordion, { type MapAccordionItem } from "@/modules/map/ui/MapAccordion";
import MapMenu from "@/modules/map/ui/MapMenu";
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

function MapDisplay({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-xs">
      <p className="w-full text-center font-kaisotai text-Ptitle text-white">{label}</p>
      <div className="flex aspect-4/3 w-full items-center justify-center border-2 border-main bg-base-dark text-center text-main">
        <div>
          <p className="font-kaisotai text-[28px]">MAP</p>
          <p className="text-[22px]">NO IMAGE</p>
        </div>
      </div>
    </div>
  );
}

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

      <div className="hidden flex-col gap-pm pb-5l md:flex">
        <section className="relative flex w-full items-start gap-l border-b-2 border-base-dark pl-5l lg:gap-4l lg:pl-pm">
          <Image
            src="/image/PageBack1.svg"
            alt=""
            aria-hidden="true"
            width={287}
            height={333}
            className="pointer-events-none absolute top-0 left-[42%] z-0 h-auto w-71.75"
          />
          <Image
            src="/image/PageBack2.svg"
            alt=""
            aria-hidden="true"
            width={243}
            height={644}
            className="pointer-events-none absolute bottom-0 left-0 z-0 h-auto w-60.75"
          />
          <div className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-3l py-5l">
            <div className="w-full">
              <SectionTitle title="マップ" />
            </div>
            <MapDisplay label="全体" />
          </div>
          <MapMenu />
        </section>
        <SponsorAdsBoundary surface="transparent" />
      </div>
    </div>
  );
}
