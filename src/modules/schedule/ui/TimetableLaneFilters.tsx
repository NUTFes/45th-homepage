import type { ScheduleLaneDTO } from "../types";
import TimetableTabs from "./TimetableTabs";

type TimetableLaneFiltersProps = {
  lanes: readonly ScheduleLaneDTO[];
  selectedLane?: ScheduleLaneDTO;
  onLaneChange: (laneId: string) => void;
};

export default function TimetableLaneFilters({
  lanes,
  selectedLane,
  onLaneChange,
}: TimetableLaneFiltersProps) {
  if (lanes.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden">
      <TimetableTabs
        ariaLabel="会場"
        controlName="schedule-mobile-lane"
        controlsIdPrefix="timetable-panel"
        items={lanes}
        onChange={onLaneChange}
        selectedItemId={selectedLane?.id}
      />
    </div>
  );
}
