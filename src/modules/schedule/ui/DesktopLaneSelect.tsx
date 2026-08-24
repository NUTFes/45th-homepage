"use client";

import { ChevronDown } from "lucide-react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

import type { ScheduleLaneDTO } from "../types";

type DesktopLaneSelectProps = {
  groupName: string;
  lanes: readonly ScheduleLaneDTO[];
  selectedLane: ScheduleLaneDTO;
  onLaneChange: (laneId: string) => void;
};

export default function DesktopLaneSelect({
  groupName,
  lanes,
  selectedLane,
  onLaneChange,
}: DesktopLaneSelectProps) {
  return (
    <Select
      className="group relative h-full w-full"
      onSelectionChange={(key) => {
        if (key !== null) {
          onLaneChange(String(key));
        }
      }}
      selectedKey={selectedLane.id}
    >
      <Label className="sr-only">{groupName}の会場</Label>
      <Button className="relative flex h-full w-full cursor-pointer items-center justify-center border-y-2 border-main bg-secondary px-m text-center text-Pbutton text-timetable-base-dark outline-hidden transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-main pressed:bg-secondary/80">
        <SelectValue className="max-w-full min-w-0 truncate text-center" />
        <ChevronDown
          aria-hidden="true"
          className="absolute right-m size-6 shrink-0 transition-transform group-data-open:rotate-180"
        />
      </Button>
      <Popover
        className="z-250 w-(--trigger-width) rounded-b-lg bg-secondary text-timetable-base-dark shadow-[0_2px_12px_var(--color-base-shadow)] outline-hidden"
        offset={0}
        placement="bottom start"
      >
        <ListBox className="max-h-80 overflow-y-auto p-1 outline-hidden">
          {lanes.map((lane) => (
            <ListBoxItem
              className="cursor-pointer rounded-md px-m py-s text-center text-Ptext outline-hidden transition-colors hover:bg-main/20 focus:bg-main focus:text-timetable-base-dark selected:font-bold"
              id={lane.id}
              key={lane.id}
              textValue={lane.name}
            >
              {lane.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
