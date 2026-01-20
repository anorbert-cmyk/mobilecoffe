// @ts-nocheck
// @ts-ignore
import {
    LayoutDashboard,
    ShoppingBag,
    Briefcase,
    CreditCard,
    ChevronRight,
    ChevronLeft,
    Plus,
    Search,
    Filter,
    MapPin,
    Star,
    Clock,
    Wifi,
    Coffee,
    Zap,
    Info,
    Check,
    X,
    User,
    LogOut,
    Settings,
    Bell,
    Menu,
    Home,
    Heart
} from 'lucide-react-native';
import { ViewStyle } from 'react-native';

export const AppIcons = {
    // Navigation
    Dashboard: LayoutDashboard,
    Products: ShoppingBag,
    Jobs: Briefcase,
    Plan: CreditCard,
    Home: Home,
    Menu: Menu,

    // Actions
    Back: ChevronLeft,
    Forward: ChevronRight,
    Plus: Plus,
    Search: Search,
    Filter: Filter,
    Settings: Settings,
    Logout: LogOut,
    Close: X,
    Check: Check,

    // Data / Status
    Location: MapPin,
    Star: Star,
    Time: Clock,
    User: User,
    Notification: Bell,
    Favorite: Heart,

    // Amenities
    Wifi: Wifi,
    Power: Zap,
    Coffee: Coffee,
    Info: Info,
} as const;

export type IconName = keyof typeof AppIcons;

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    style?: ViewStyle;
    strokeWidth?: number;
}

export function Icon({ name, size = 24, color = '#000', style, strokeWidth = 2 }: IconProps) {
    const IconComponent = AppIcons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in AppIcons registry.`);
        return null;
    }

    return <IconComponent size={size} color={color} style={style} strokeWidth={strokeWidth} />;
}
