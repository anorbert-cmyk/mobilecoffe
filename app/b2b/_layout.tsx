import { Stack } from "expo-router";

export default function B2BLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" options={{ presentation: 'modal' }} />
            <Stack.Screen name="register" options={{ presentation: 'modal' }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        </Stack>
    );
}
