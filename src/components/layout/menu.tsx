import { House, Clock, MapPin, CalendarDays, LucideIcon } from "lucide-react";

type SubMenuItem = {
    label: string;
    href: string;
}

type MenuItem = {
    label: string;
    icon: LucideIcon;
    href: string;
    children?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    {
        label: "トップ",
        icon: House,
        href: "/"
    },
    {
        label: "イベント・販売",
        icon: House,
        href: "/",
        children: [
            {
                label: "ゲスト",
                href: "/"
            },
            {
                label: "コラボ",
                href: "/"
            },
            {
                label: "企画",
                href: "/"
            },
            {
                label: "展示・体験",
                href: "/"
            },
            {
                label: "食品販売",
                href: "/"
            },
            {
                label: "物品販売",
                href: "/"
            },
            {
                label: "企業ブース",
                href: "/"
            },
        ]
    },
    {
        label: "タイムスケジュール",
        icon: House,
        href: "/"
    },
    {
        label: "マップ",
        icon: House,
        href: "/"
    },
    {
        label: "利用案内",
        icon: House,
        href: "/",
        children: [
            {
                label: "注意事項",
                href:"/"
            },
            {
                label: "案内所・ヘルプ",
                href:"/"
            },
            {
                label: "アクセス",
                href:"/"
            },
        ]
    },
    {
        label: "代表者挨拶",
        icon: House,
        href: "/"
    },
    {
        label: "協賛企業一覧",
        icon: House,
        href: "/"
    },
]

export default function Menu() {
    return (
        <div>
            <h1>Menu</h1>
        </div>
    )
}
