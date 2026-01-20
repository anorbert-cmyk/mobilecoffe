import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = (segments[0] as string) === '(auth)'; // Assuming (auth) group for login/register

        if (requireAuth && !isAuthenticated && !inAuthGroup) {
            // Redirect to login
            // router.replace('/login'); // TODO: Define login route
            console.log("[AuthGuard] User not authenticated, should redirect to login");
        }
    }, [user, loading, isAuthenticated, segments, requireAuth]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D97706" />
            </View>
        );
    }

    if (requireAuth && !isAuthenticated) {
        // Return null or placeholder while redirecting
        return null;
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
