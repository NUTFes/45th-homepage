import Link from "next/link";
import { House, Clock, MapPin, CalendarDays, LucideIcon } from "lucide-react";
import BottomNavMenuButton from "@/components/layout/BottomNavMenuButton";

type NavItemType = {
  name: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
};

function NavItem({ item }: { item: NavItemType }) {
  const isActive = !item.disabled && item.href !== undefined;
  const color = isActive ? "text-secondary" : "text-secondary/60";
  const wrapperClass = "flex h-14.25 w-full flex-col items-center justify-center gap-1";

  const inner = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <item.icon className={`shrink-0 ${color}`} size={30} />
      </div>
      <span className={`text-text-small whitespace-nowrap ${color}`}>{item.name}</span>
    </>
  );

  if (!isActive) {
    return <div className={`pointer-events-none ${wrapperClass}`}>{inner}</div>;
  }
  return (
    <Link href={item.href} className={wrapperClass}>
      {inner}
    </Link>
  );
}

export default function BottomNavigation() {
  const regularItems: NavItemType[] = [
    { name: "ホーム", icon: House, href: "/" },
    { name: "スケジュール", icon: Clock, disabled: true, href: "/schedule" },
    { name: "マップ", icon: MapPin, disabled: true, href: "/map" },
    { name: "企画", icon: CalendarDays, disabled: true, href: "/events" },
  ];

  return (
    <nav className="sticky right-0 bottom-0 left-0 flex bg-base-dark px-s py-ss md:hidden">
      <ul className="flex w-full list-none justify-between">
        {regularItems.map((item) => (
          <li key={item.name} className="flex-1">
            <NavItem item={item} />
          </li>
        ))}

        <li className="flex-1">
          <BottomNavMenuButton />
        </li>
      </ul>
    </nav>
  );
}
