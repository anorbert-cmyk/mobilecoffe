import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { IconSymbol } from '@/components/ui/icon-symbol';
import paywallHero from '@/assets/images/subscription/paywall-hero.png';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  featureName: string;
  requiredTier: 'enthusiast' | 'pro';
}

export function Paywall({ visible, onClose, feature, featureName, requiredTier }: PaywallProps) {
  const colors = useColors();
  const { tier } = useSubscription();

  const handleUpgrade = () => {
    onClose();
    router.push('/subscription/plans' as any);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Hero Image */}
          <Image source={paywallHero} style={styles.heroImage} contentFit="cover" />

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.badge, { backgroundColor: colors.primary + '20', color: colors.primary }]}>
              {requiredTier === 'pro' ? 'PRO FEATURE' : 'ENTHUSIAST FEATURE'}
            </Text>
            
            <Text style={[styles.title, { color: colors.foreground }]}>
              Unlock {featureName}
            </Text>
            
            <Text style={[styles.description, { color: colors.muted }]}>
              {getFeatureDescription(feature)}
            </Text>

            {/* Benefits */}
            <View style={styles.benefits}>
              {getFeatureBenefits(feature).map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={[styles.checkIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol name="checkmark" size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.benefitText, { color: colors.foreground }]}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <Pressable
              onPress={handleUpgrade}
              style={({ pressed }) => [
                styles.upgradeButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={[styles.upgradeButtonText, { color: '#FFFFFF' }]}>
                Upgrade to {requiredTier === 'pro' ? 'Pro' : 'Enthusiast'}
              </Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.cancelButtonText, { color: colors.muted }]}>
                Maybe Later
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    'equipment-comparison': 'Compare up to 3 espresso machines or grinders side-by-side with detailed specs, prices, and match scores.',
    'favorites': 'Save and organize your favorite coffees, equipment, beans, and articles in one place.',
    'brewing-journal': 'Track your brewing recipes, tasting notes, and progress over time with detailed analytics.',
    'bean-marketplace': 'Access our curated marketplace of specialty coffee beans with personalized recommendations.',
    'video-courses': 'Learn from the pros with our complete video course library covering brewing, latte art, and espresso mastery.'
  };
  return descriptions[feature] || 'Upgrade to access this premium feature.';
}

function getFeatureBenefits(feature: string): string[] {
  const benefits: Record<string, string[]> = {
    'equipment-comparison': [
      'Side-by-side comparison of specs',
      'Price comparison across retailers',
      'Match score based on your preferences',
      'Save comparisons for later'
    ],
    'favorites': [
      'Unlimited favorites across all categories',
      'Organize by custom collections',
      'Quick access from your profile',
      'Sync across devices'
    ],
    'brewing-journal': [
      'Log unlimited brewing sessions',
      'Track recipe variations and results',
      'View progress analytics and insights',
      'Export your data anytime'
    ],
    'bean-marketplace': [
      'Personalized bean recommendations',
      'Access to 16+ specialty roasters',
      'Exclusive discounts and offers',
      'Flavor profile matching'
    ],
    'video-courses': [
      '4 complete courses (180+ minutes)',
      'Learn from world-class instructors',
      'Download for offline viewing',
      'New courses added regularly'
    ]
  };
  return benefits[feature] || ['Access premium features', 'Ad-free experience', 'Priority support'];
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 60
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroImage: {
    width: '100%',
    height: 200
  },
  content: {
    padding: 24
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32
  },
  benefits: {
    gap: 16,
    marginBottom: 32
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22
  },
  upgradeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '600'
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 15
  }
});
