import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, Dimensions , Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { PremiumCard } from '@/components/ui/premium-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { getGrinderById } from '@/data/machines';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function GrinderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const grinder = getGrinderById(id);
  const [imageViewVisible, setImageViewVisible] = useState(false);

  if (!grinder) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>Grinder not found</Text>
      </ScreenContainer>
    );
  }

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <View style={styles.infoRow}>
      {icon && <IconSymbol name={icon as any} size={20} color={colors.primary} />}
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: colors.primary,
        }}
      />
      <ScreenContainer edges={["left", "right"]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Equipment', href: '/recommendations' },
            { label: grinder.name }
          ]} />
          {/* Hero Image */}
          <Animated.View entering={FadeIn.duration(400)}>
            <Pressable 
              onPress={() => {
                triggerHaptic();
                setImageViewVisible(true);
              }}
              style={styles.heroImageContainer}
              accessibilityRole="button"
              accessibilityLabel="Tap to view full image"
            >
              <Image
                source={grinder.image || require('@/assets/images/icon.png')}
                style={styles.heroImage}
                contentFit="contain"
                transition={300}
                placeholder={require('@/assets/images/icon.png')}
              />
              <LinearGradient
                colors={['transparent', colors.background]}
                style={styles.heroGradient}
              />
              {/* Zoom indicator */}
              <View style={[styles.zoomIndicator, { backgroundColor: `${colors.background}CC` }]}>
                <IconSymbol name="magnifyingglass" size={16} color={colors.foreground} />
                <Text style={[styles.zoomText, { color: colors.foreground }]}>Tap to zoom</Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Image Viewer Modal */}
          <Modal
            visible={imageViewVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageViewVisible(false)}
          >
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setImageViewVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close image viewer"
            >
              <View style={styles.modalContent}>
            <Image
              source={grinder.image || require('@/assets/images/icon.png')}
                  style={styles.modalImage}
                  contentFit="contain"
                  transition={300}
                />
                <Pressable 
                  style={[styles.closeButton, { backgroundColor: colors.surface }]}
                  onPress={() => setImageViewVisible(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </Pressable>
              </View>
            </Pressable>
          </Modal>

          {/* Title Section */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.titleSection}
          >
            <Text style={[styles.brand, { color: colors.muted }]}>{grinder.brand}</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{grinder.name}</Text>
            
            {/* Quick Info Badges */}
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: `${colors.primary}15` }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {grinder.type === 'electric' ? 'Electric' : 'Manual'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${colors.success}15` }]}>
                <Text style={[styles.badgeText, { color: colors.success }]}>
                  {grinder.burrType} burrs
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${colors.warning}15` }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>
                  ${grinder.price}
                </Text>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <IconSymbol name="star.fill" size={18} color="#FFB800" />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>
                {grinder.rating}/5.0
              </Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                About
              </Text>
              <Text style={[styles.description, { color: colors.muted }]}>
                {grinder.description}
              </Text>
            </PremiumCard>
          </Animated.View>

          {/* Specifications */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Specifications
              </Text>
              
              <View style={styles.specsGrid}>
                <View style={[styles.specCard, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="dial.low.fill" size={24} color={colors.primary} />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>
                    {grinder.burrSize}mm
                  </Text>
                  <Text style={[styles.specLabel, { color: colors.muted }]}>
                    Burr Size
                  </Text>
                </View>
                
                <View style={[styles.specCard, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="slider.horizontal.3" size={24} color={colors.primary} />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>
                    {typeof grinder.grindSettings === 'number' ? grinder.grindSettings : 'Stepless'}
                  </Text>
                  <Text style={[styles.specLabel, { color: colors.muted }]}>
                    Settings
                  </Text>
                </View>
                
                <View style={[styles.specCard, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="arrow.down.circle.fill" size={24} color={colors.primary} />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>
                    {grinder.retention.charAt(0).toUpperCase() + grinder.retention.slice(1)}
                  </Text>
                  <Text style={[styles.specLabel, { color: colors.muted }]}>
                    Retention
                  </Text>
                </View>
                
                <View style={[styles.specCard, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="gearshape.fill" size={24} color={colors.primary} />
                  <Text style={[styles.specValue, { color: colors.foreground }]}>
                    {grinder.burrType.charAt(0).toUpperCase() + grinder.burrType.slice(1)}
                  </Text>
                  <Text style={[styles.specLabel, { color: colors.muted }]}>
                    Burr Type
                  </Text>
                </View>
              </View>
            </PremiumCard>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Features
              </Text>
              {grinder.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureRow}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  <Text style={[styles.featureText, { color: colors.foreground }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </PremiumCard>
          </Animated.View>

          {/* Best For */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Best For
              </Text>
              {grinder.bestFor.map((use: string, index: number) => (
                <View key={index} style={styles.featureRow}>
                  <IconSymbol name="star.fill" size={18} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.foreground }]}>
                    {use}
                  </Text>
                </View>
              ))}
            </PremiumCard>
          </Animated.View>

          {/* Tips */}
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Pro Tips
              </Text>
              {grinder.tips.map((tip: string, index: number) => (
                <View key={index} style={styles.tipRow}>
                  <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.tipText, { color: colors.foreground }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </PremiumCard>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  heroImageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  zoomText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  specCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  specValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
});
