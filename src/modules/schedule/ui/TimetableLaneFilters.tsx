import type { ScheduleGroupDTO, ScheduleLaneDTO } from "../types";

type TimetableLaneFiltersProps = {
  selectedLane?: ScheduleLaneDTO;
  selectedGroup?: ScheduleGroupDTO;
  groups: readonly ScheduleGroupDTO[];
  onLaneChange: (laneId: string) => void;
  onGroupChange: (groupId: string) => void;
};

export default function TimetableLaneFilters({
  selectedLane,
  selectedGroup,
  groups,
  onLaneChange,
  onGroupChange,
}: TimetableLaneFiltersProps) {
  const lanes = selectedGroup?.lanes ?? [];

  return (
    <div className="bg-base">
      {groups.length > 0 ? (
        <fieldset className="[scrollbar-width:thin] overflow-x-auto px-xs pt-ss">
          <legend className="sr-only">会場グループ</legend>
          <div className="flex min-w-max items-end gap-1">
            {groups.map((group) => (
              <label key={group.id} className="cursor-pointer">
                <input
                  checked={selectedGroup?.id === group.id}
                  className="peer sr-only"
                  name="schedule-group"
                  onChange={() => onGroupChange(group.id)}
                  type="radio"
                  value={group.id}
                />
                <span className="flex h-14 w-25 items-center justify-center rounded-t-lg border-2 border-main px-ss text-center text-textb text-font-main transition-colors peer-checked:bg-secondary peer-checked:text-base-dark peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main">
                  {group.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="border-t-[3px] border-main bg-base-dark px-m py-s shadow-[0_2px_6px_0_var(--color-base-shadow)]">
        {selectedGroup && lanes.length > 0 ? (
          <label
            className="flex items-center gap-xs text-textb text-font-main"
            htmlFor="schedule-lane"
          >
            <span className="shrink-0">会場</span>
            <select
              className="min-w-0 flex-1 rounded border-2 border-main bg-secondary px-xs py-ss text-textb text-base-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
              id="schedule-lane"
              onChange={(event) => onLaneChange(event.target.value)}
              value={selectedLane?.id ?? ""}
            >
              {lanes.map((lane) => (
                <option key={lane.id} value={lane.id}>
                  {lane.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-center text-text text-font-main">
            {selectedGroup
              ? "この会場グループには使用中の会場がありません"
              : "会場グループを準備中です"}
          </p>
        )}
      </div>
    </div>
  );
}
