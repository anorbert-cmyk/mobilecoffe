import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function B2BLanding() {
    const router = useRouter();
    const colors = useColors();

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.content}>
                    <IconSymbol name="building.2.fill" size={64} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.foreground }]}>
                        Coffee Craft Business
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        Manage your cafe, find talent, and reach more coffee lovers.
                    </Text>

                    <View style={styles.buttons}>
                        <PremiumButton
                            variant="primary"
                            onPress={() => router.push('/b2b/login')}
                            fullWidth
                        >
                            Log In
                        </PremiumButton>

                        <View style={{ height: 16 }} />

                        <PremiumButton
                            variant="secondary"
                            onPress={() => router.push('/b2b/register')}
                            fullWidth
                        >
                            Register New Business
                        </PremiumButton>

                        <View style={{ height: 32 }} />

                        <PremiumButton
                            variant="ghost"
                            onPress={() => router.back()}
                            fullWidth
                        >
                            Continue as User
                        </PremiumButton>
                    </View>
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    buttons: {
        width: '100%',
    },
});
