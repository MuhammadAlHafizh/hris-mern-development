import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    Megaphone,
    Calendar,
    FileText,
    ChevronLeft,
    Building2,
    ChevronDown,
    ChevronRight,
    UserCog,
    Briefcase,
    ClipboardList,
    CalendarDays,
    ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    roles: ('admin' | 'manager' | 'staff')[];
}

interface NavigationItemWithSubmenu {
    name: string;
    icon: React.ComponentType<any>;
    submenu: NavigationItem[];
    roles: ('admin' | 'manager' | 'staff')[];
}

type Navigation = (NavigationItem | NavigationItemWithSubmenu)[];

const ADMIN_BASE = '/administration';

// Menu untuk semua role
const navigation: Navigation = [
    {
        name: 'Dashboard',
        href: `${ADMIN_BASE}/dashboard`,
        icon: Home,
        roles: ['admin', 'manager', 'staff']
    },
    {
        name: 'Attendance',
        href: `${ADMIN_BASE}/attendance`,
        icon: CalendarDays,
        roles: ['admin', 'manager', 'staff']
    },
    {
        name: 'Master',
        icon: UserCog,
        roles: ['admin', 'manager'],
        submenu: [
            {
                name: 'Users',
                href: `${ADMIN_BASE}/users`,
                icon: Users,
                roles: ['admin', 'manager']
            },
            {
                name: 'Position',
                href: `${ADMIN_BASE}/positions`,
                icon: Briefcase,
                roles: ['admin', 'manager']
            }
        ]
    },
    {
        name: 'Leave Management',
        icon: Calendar,
        roles: ['admin', 'manager', 'staff'],
        submenu: [
            {
                name: 'Annual Leave',
                href: `${ADMIN_BASE}/annual-leave`,
                icon: Calendar,
                roles: ['admin', 'manager']
            },
            {
                name: 'Leave Requests', // Untuk admin/manager
                href: `${ADMIN_BASE}/admin-leave`,
                icon: ClipboardCheck,
                roles: ['admin', 'manager']
            },
            {
                name: 'My Leave', // Untuk staff
                href: `${ADMIN_BASE}/leave`,
                icon: ClipboardList,
                roles: ['staff']
            },
        ]
    },
    // {
    //     name: 'Announcements',
    //     href: `${ADMIN_BASE}/announcements`,
    //     icon: Megaphone,
    //     roles: ['admin', 'manager']
    // },
    {
        name: 'Reports',
        icon: FileText,
        roles: ['admin', 'manager'],
        submenu: [
            {
                name: 'Pengajuan Cuti',
                href: `${ADMIN_BASE}/reports/leave-requests`,
                icon: ClipboardList,
                roles: ['admin', 'manager']
            },
            {
                name: 'Absensi',
                href: `${ADMIN_BASE}/reports/attendance`,
                icon: CalendarDays,
                roles: ['admin', 'manager', 'staff']
            }
        ]
    },
];

const hasSubmenu = (item: NavigationItem | NavigationItemWithSubmenu): item is NavigationItemWithSubmenu =>
    'submenu' in item;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [dropdowns, setDropdowns] = React.useState<{ [key: string]: boolean }>({});
    const { user } = useAuth();

    // Filter menu berdasarkan role user
    const filteredNavigation = navigation.filter(item => {
        return item.roles.includes(user?.role as any);
    });

    // Tentukan menu terbuka otomatis berdasarkan URL
    React.useEffect(() => {
        setDropdowns({
            master:
                location.pathname.startsWith(`${ADMIN_BASE}/users`) ||
                location.pathname.startsWith(`${ADMIN_BASE}/positions`),
            reports: location.pathname.startsWith(`${ADMIN_BASE}/reports`),
            'leave management':
                location.pathname.startsWith(`${ADMIN_BASE}/annual-leave`) ||
                location.pathname.startsWith(`${ADMIN_BASE}/leave`) ||
                location.pathname.startsWith(`${ADMIN_BASE}/admin-leave`),
        });
    }, [location.pathname]);

    const toggleDropdown = (menuName: string) => {
        setDropdowns(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    // Helper function untuk check jika item menu bisa diakses
    const canAccessItem = (item: NavigationItem | NavigationItemWithSubmenu) => {
        return item.roles.includes(user?.role as any);
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            <div
                className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                            <span className="text-xl font-bold text-black">CMS Admin</span>
                            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <nav className="mt-8 px-4">
                    <div className="space-y-1">
                        {filteredNavigation.map(item => (
                            <div key={item.name}>
                                {hasSubmenu(item) ? (
                                    <div>
                                        <button
                                            onClick={() => toggleDropdown(item.name.toLowerCase())}
                                            className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${dropdowns[item.name.toLowerCase()]
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 text-black'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className="mr-3 h-5 w-5" />
                                                {item.name}
                                            </div>
                                            {dropdowns[item.name.toLowerCase()] ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>

                                        {dropdowns[item.name.toLowerCase()] && (
                                            <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                                                {item.submenu.map(sub => (
                                                    canAccessItem(sub) && (
                                                        <NavLink
                                                            key={sub.name}
                                                            to={sub.href}
                                                            className={({ isActive }) =>
                                                                `flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive
                                                                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 -ml-0.5'
                                                                    : 'text-gray-600 hover:bg-gray-50 text-black'
                                                                }`
                                                            }
                                                            onClick={() => window.innerWidth < 1024 && onClose()}
                                                        >
                                                            <sub.icon className="mr-3 h-4 w-4" />
                                                            {sub.name}
                                                        </NavLink>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    canAccessItem(item) && (
                                        <NavLink
                                            to={item.href}
                                            className={({ isActive }) =>
                                                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-50 text-black'
                                                }`
                                            }
                                            onClick={() => window.innerWidth < 1024 && onClose()}
                                        >
                                            <item.icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </NavLink>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
};
