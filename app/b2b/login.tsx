import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getApiBaseUrl } from '@/constants/oauth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_TOKEN_KEY = 'app_session_token';

export default function B2BLogin() {
    const router = useRouter();
    const colors = useColors();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const utils = trpc.useUtils();
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

    const handleDemoLogin = async () => {
        setIsLoggingIn(true);
        try {
            const apiBase = getApiBaseUrl();
            const response = await fetch(`${apiBase}/api/demo-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (data.success && data.token) {
                // Store the session token
                await AsyncStorage.setItem(SESSION_TOKEN_KEY, data.token);

                // Invalidate and refetch auth queries
                await utils.auth.me.invalidate();
                await utils.business.getMine.invalidate();

                // Force navigation immediately
                router.replace('/b2b/dashboard');
            } else {
                Alert.alert('Login Failed', data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Demo login error:', error);
            Alert.alert('Login Failed', String(error));
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <IconSymbol name="building.2.fill" size={64} color={colors.primary} />
                <Text style={[styles.title, { color: colors.foreground }]}>Business Login</Text>

                {isLoading ? (
                    <Text style={{ color: colors.foreground }}>Checking session...</Text>
                ) : (
                    <>
                        <Text style={{ color: colors.muted, textAlign: 'center', marginBottom: 20 }}>
                            Sign in to manage your cafe or roastery.
                        </Text>

                        <View style={styles.infoBox}>
                            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
                                Demo Mode: Use the button below to log in as a test user.{'\n'}
                                Google/Apple login coming soon!
                            </Text>
                        </View>

                        <PremiumButton
                            variant="primary"
                            onPress={handleDemoLogin}
                            fullWidth
                            loading={isLoggingIn}
                            leftIcon={<IconSymbol name="person.fill" size={20} color="white" />}
                        >
                            Demo Login
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
        marginTop: 16,
    },
    infoBox: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        width: '100%',
    },
});
