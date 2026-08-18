type TimetableTabItem = {
  id: string;
  name: string;
};

type TimetableTabsProps = {
  ariaLabel: string;
  controlName: string;
  items: readonly TimetableTabItem[];
  onChange: (itemId: string) => void;
  selectedItemId?: string | null;
};

export default function TimetableTabs({
  ariaLabel,
  controlName,
  items,
  onChange,
  selectedItemId,
}: TimetableTabsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-base">
      <fieldset className="[scrollbar-width:thin] overflow-x-auto pt-4l">
        <legend className="sr-only">{ariaLabel}</legend>
        <div className="flex min-w-max items-end px-xs md:px-pm">
          {items.map((item) => (
            <label key={item.id} className="cursor-pointer">
              <input
                checked={selectedItemId === item.id}
                className="peer sr-only"
                name={controlName}
                onChange={() => onChange(item.id)}
                type="radio"
                value={item.id}
              />
              <span className="flex h-14 w-25 items-center justify-center rounded-t-lg border-2 border-main px-ss text-center text-textb font-bold text-font-main transition-colors peer-checked:bg-secondary peer-checked:text-base-dark peer-checked:shadow-[0_0_6px_var(--color-base-shadow)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main md:h-17 md:w-30 md:px-s md:text-Pbutton">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="h-[3px] bg-main shadow-[0_2px_6px_0_var(--color-base-shadow)] md:h-0.5 md:shadow-none" />
    </div>
  );
}
