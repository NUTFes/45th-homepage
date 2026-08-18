import type { ScheduleLaneDTO } from "../types";

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
    <div className="bg-base md:hidden">
      <fieldset className="[scrollbar-width:thin] overflow-x-auto px-xs pt-4l">
        <legend className="sr-only">会場</legend>
        <div className="flex min-w-max items-end">
          {lanes.map((lane) => (
            <label key={lane.id} className="cursor-pointer">
              <input
                checked={selectedLane?.id === lane.id}
                className="peer sr-only"
                name="schedule-mobile-lane"
                onChange={() => onLaneChange(lane.id)}
                type="radio"
                value={lane.id}
              />
              <span className="flex h-14 w-32 items-center justify-center rounded-t-lg border-2 border-main px-ss text-center text-textb font-bold text-font-main transition-colors peer-checked:bg-secondary peer-checked:text-base-dark peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main">
                {lane.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="h-[3px] bg-main shadow-[0_2px_6px_0_var(--color-base-shadow)]" />
    </div>
  );
}
