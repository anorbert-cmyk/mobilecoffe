import { Tabs } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { FloatingTabBar } from '@/components/navigation/floating-tab-bar';
import { View } from 'react-native';

export default function DashboardLayout() {
    const colors = useColors();

    return (
        <Tabs
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.background,
                    // Remove bottom border for cleaner look
                    shadowOpacity: 0,
                    elevation: 0,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: colors.foreground,
                    fontSize: 28,
                    fontWeight: '800', // Modern bold headers
                    fontFamily: 'Inter_900Black', // Assuming Inter is available
                },
                headerTitleAlign: 'left', // More like iOS Large Title
                headerLeftContainerStyle: { paddingLeft: 20 },
                // Add padding to content bottom so it's not hidden by floating bar
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'Products',
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Jobs',
                }}
            />
            <Tabs.Screen
                name="subscription"
                options={{
                    title: 'Plan',
                }}
            />
        </Tabs>
    );
}
