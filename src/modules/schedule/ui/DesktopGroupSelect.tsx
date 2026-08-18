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

import type { ScheduleGroupDTO } from "../types";

type DesktopGroupSelectProps = {
  groups: readonly ScheduleGroupDTO[];
  selectedGroup?: ScheduleGroupDTO;
  onGroupChange: (groupId: string) => void;
};

export default function DesktopGroupSelect({
  groups,
  selectedGroup,
  onGroupChange,
}: DesktopGroupSelectProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <Select
      className="group relative w-69.75"
      onSelectionChange={(key) => {
        if (key !== null) {
          onGroupChange(String(key));
        }
      }}
      selectedKey={selectedGroup?.id ?? null}
    >
      <Label className="sr-only">会場グループ</Label>
      <Button className="flex min-h-14.5 w-full cursor-pointer items-center justify-between gap-s rounded-t-lg border-2 border-main bg-secondary px-m py-s text-left text-Pbutton text-base-dark shadow-[0_0_6px_var(--color-base-shadow)] outline-hidden transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main pressed:bg-secondary/80">
        <SelectValue className="min-w-0 flex-1 truncate" />
        <ChevronDown
          aria-hidden="true"
          className="size-6 shrink-0 transition-transform group-data-open:rotate-180"
        />
      </Button>
      <Popover
        className="z-200 w-(--trigger-width) rounded-b-lg bg-secondary text-base-dark shadow-[0_2px_12px_var(--color-base-shadow)] outline-hidden"
        offset={0}
        placement="bottom start"
      >
        <ListBox className="max-h-80 overflow-y-auto p-1 outline-hidden">
          {groups.map((group) => (
            <ListBoxItem
              id={group.id}
              key={group.id}
              textValue={group.name}
              className="cursor-pointer rounded-md px-m py-s text-Ptext outline-hidden transition-colors hover:bg-main/20 focus:bg-main focus:text-base-dark selected:font-bold"
            >
              {group.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
