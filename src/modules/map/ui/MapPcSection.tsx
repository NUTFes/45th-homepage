"use client";

import { useState } from "react";
import Image from "next/image";

import SectionTitle from "@/components/ui/SectionTitle";
import MapMenu from "@/modules/map/ui/MapMenu";
import { defaultMapMenuSections, getMapDisplayLabel } from "@/modules/map/ui/mapMenuData";

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

export default function MapPcSection() {
  const [selectedId, setSelectedId] = useState<string>(defaultMapMenuSections[0].id);
  const selectedLabel = getMapDisplayLabel(selectedId);

  return (
    <section className="relative flex w-full items-start gap-l border-b-2 border-base-dark pl-5l lg:gap-4l lg:pl-pm">
      <Image
        src="/image/PageBack1.svg"
        alt=""
        aria-hidden="true"
        width={287}
        height={333}
        className="pointer-events-none absolute -top-5l right-118 z-0 h-auto w-71.75"
      />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col py-5l">
        <Image
          src="/image/PageBack2.svg"
          alt=""
          aria-hidden="true"
          width={243}
          height={644}
          className="pointer-events-none absolute top-full -left-5l z-0 h-auto w-60.75 -translate-y-1/4 lg:-left-pm"
        />
        <div className="relative z-10 flex w-full flex-col items-center gap-3l">
          <div className="w-full">
            <SectionTitle title="マップ" />
          </div>
          <MapDisplay label={selectedLabel} />
        </div>
      </div>
      <MapMenu selectedId={selectedId} onSelect={setSelectedId} />
    </section>
  );
}
