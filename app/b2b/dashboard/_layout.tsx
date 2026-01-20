import { Tabs } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { FloatingTabBar } from '@/components/navigation/floating-tab-bar';

export default function DashboardLayout() {
    const colors = useColors();

    return (
        <Tabs
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowOpacity: 0,
                    elevation: 0,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: colors.foreground,
                    fontSize: 28,
                    fontWeight: '800',
                },
                headerTitleAlign: 'left',
                headerLeftContainerStyle: { paddingLeft: 20 },
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            {/* Visible Tabs */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Menu',
                }}
            />

            {/* Hidden Screens (still navigable, but not in tab bar) */}
            <Tabs.Screen
                name="events"
                options={{
                    href: null,
                    title: 'Events',
                }}
            />
            <Tabs.Screen
                name="subscription"
                options={{
                    href: null,
                    title: 'Subscription',
                }}
            />
            {/* jobs folder is auto-handled as nested stack */}
        </Tabs>
    );
}
