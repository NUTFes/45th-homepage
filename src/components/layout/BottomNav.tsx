import { House, Clock, MapPin, CalendarDays, Menu } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "ホーム", icon: House, href: "/" },
  { name: "スケジュール", icon: Clock, href: "/" },
  { name: "マップ", icon: MapPin, href: "/" },
  { name: "企画", icon: CalendarDays, href: "/" },
  { name: "メニュー", icon: Menu, href: "/" },
];

export default function BottomNavigation() {
  return (
    <nav className="sticky right-0 bottom-0 left-0 flex bg-base-dark px-s py-ss md:hidden">
      <ul className="flex w-full list-none justify-between">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <Link
              href={item.href}
              className="flex h-14.25 flex-col items-center justify-center gap-1"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                <item.icon className="shrink-0 text-secondary" size={30} />
              </div>
              <span className="text-text-small whitespace-nowrap text-secondary">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
