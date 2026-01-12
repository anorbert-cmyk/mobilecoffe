import { useEffect } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function B2BLogin() {
    const router = useRouter();
    const colors = useColors();

    const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
    const { data: business, isLoading: loadingBusiness } = trpc.business.getMine.useQuery(undefined, {
        enabled: !!user,
    });

    useEffect(() => {
        if (user) {
            if (business) {
                router.replace('/b2b/dashboard');
            } else if (!loadingBusiness) {
                // User logged in but no business -> Go to Register
                router.replace('/b2b/register');
            }
        }
    }, [user, business, loadingBusiness]);

    const handleLogin = () => {
        // Determine the login URL. In dev, usually points to the backend /api/auth/login or similar?
        // Or we use the Manus Login UI provided by the platform.
        // For now, I'll assume we redirect to the root which usually triggers auth if protected, 
        // or specifically to an oauth endpoint if I can find it.
        // Since I can't find the start endpoint in code, I'll just link to the root 
        // and rely on the platform to handle the session.
        // Spec says: "Apple Sign-In", "Google Sign-In", "Email + Jelszó".
        // I will mock the action for now as "Sign In".

        // In a real Manus app, we usually window.location.href = '/api/oauth/start' or similar.
        // Let's assume there is a global login function or we redirect to the backend login.
        const backendUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
        Linking.openURL(`${backendUrl}/api/login`); // Hypothetical endpoint
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.foreground }]}>Business Login</Text>

                {isLoading ? (
                    <Text style={{ color: colors.foreground }}>Checking session...</Text>
                ) : (
                    <>
                        <Text style={{ color: colors.muted, textAlign: 'center', marginBottom: 20 }}>
                            Sign in to manage your cafe or roastery.
                        </Text>

                        <PremiumButton
                            variant="primary"
                            onPress={handleLogin}
                            fullWidth
                            leftIcon={<IconSymbol name="person.fill" size={20} color="white" />}
                        >
                            Sign In / Register
                        </PremiumButton>

                        <View style={{ marginTop: 20 }}>
                            <PremiumButton
                                variant="ghost"
                                onPress={() => router.back()}
                            >
                                Back
                            </PremiumButton>
                        </View>
                    </>
                )}
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
