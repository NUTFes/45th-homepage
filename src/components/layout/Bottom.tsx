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
    <nav className="flex bg-base-dark sticky bottom-0 right-0 left-0 px-s py-ss md:hidden">
      <ul className="flex justify-between w-full list-none">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <Link
              href={item.href}
              className="flex flex-col items-center h-[57px] justify-center gap-1"
            >
              <item.icon className="text-secondary shrink-0" size={36} />
              <span className="text-secondary text-text-small text-small--font-weight whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
