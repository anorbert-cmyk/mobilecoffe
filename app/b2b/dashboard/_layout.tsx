import { Tabs } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Platform } from 'react-native';

export default function DashboardLayout() {
    const colors = useColors();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                },
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTitleStyle: {
                    color: colors.foreground,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Overview',
                    tabBarIcon: ({ color }) => <IconSymbol name="chart.bar.fill" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color }) => <IconSymbol name="cup.and.saucer.fill" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color }) => <IconSymbol name="briefcase.fill" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="subscription"
                options={{
                    title: 'Plan',
                    tabBarIcon: ({ color }) => <IconSymbol name="creditcard.fill" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
