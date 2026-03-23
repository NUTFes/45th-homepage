import { House, Clock, MapPin, CalendarDays, Menu} from 'lucide-react';

const navItems = [
    { name: 'ホーム' , icon: House, href: '/', size: 36},
    { name: 'スケジュール' , icon: Clock, href: '/', size: 36},
    { name: 'マップ' , icon: MapPin, href: '/', size: 36},
    { name: '企画' , icon: CalendarDays, href: '/', size: 36},
    { name: 'メニュー' , icon: Menu, href: '/', size: 36},
];

export default function BottomNavigation(){
    return (
        <nav className='flex justify-between bg-base-dark fixed bottom-0 right-0 left-0 px-s py-ss md:hidden'>
            {navItems.map((item) => (
                <div key = {item.name} className = 'flex flex-col items-center flex-1 h-[57px] justify-center gap-1'>
                    <item.icon  className = 'text-secondary shrink-0' size={item.size}/>
                    <span className='text-secondary text-text-small text-small--font-weight whitespace-nowrap'>{item.name}</span>
                </div>
            ))}
        </nav>
    )
}
