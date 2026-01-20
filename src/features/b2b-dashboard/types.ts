import { IconSymbolName } from '@/components/ui/icon-symbol';

export interface DashboardStat {
    label: string;
    value: string | number;
    icon: IconSymbolName;
    trend?: string;
    color: string;
}
