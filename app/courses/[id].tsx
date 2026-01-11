import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { courses, Lesson } from '@/data/courses';
import { useCourseProgress } from '@/lib/course-progress/course-progress-provider';

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { hasAccess } = useSubscription();
  const { getProgress, markLessonComplete, getCourseCompletionPercentage } = useCourseProgress();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.foreground }}>Course not found</Text>
      </ScreenContainer>
    );
  }

  const completionPercentage = getCourseCompletionPercentage(course.id);
  const isComplete = completionPercentage === 100;

  const handleLessonPress = (lesson: Lesson) => {
    triggerHaptic();
    if (lesson.isPremium && !hasAccess('video-courses')) {
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleLessonComplete = () => {
    if (selectedLesson) {
      markLessonComplete(course.id, selectedLesson.id);
      triggerHaptic();
      setSelectedLesson(null);
      
      const newPercentage = getCourseCompletionPercentage(course.id);
      if (newPercentage === 100) {
        setTimeout(() => setShowCertificate(true), 500);
      }
    }
  };

  const getLessonProgress = (lessonId: string) => {
    const progress = getProgress(course.id);
    return progress?.completedLessons.includes(lessonId) || false;
  };

  // Video player modal
  if (selectedLesson) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.playerContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.playerHeader, { backgroundColor: colors.surface }]}>
            <Pressable onPress={() => setSelectedLesson(null)} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.playerTitle, { color: colors.foreground }]} numberOfLines={1}>
              {selectedLesson.title}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={[styles.videoArea, { backgroundColor: '#000' }]}>
            {selectedLesson.type === 'video' ? (
              <View style={styles.videoPlaceholder}>
                <IconSymbol name="play.circle.fill" size={80} color="#FFFFFF" />
                <Text style={styles.videoPlaceholderText}>Video Player</Text>
                <Text style={styles.videoPlaceholderSubtext}>{selectedLesson.duration} min</Text>
              </View>
            ) : (
              <ScrollView style={styles.articleContent} contentContainerStyle={styles.articleContentContainer}>
                <Text style={[styles.articleText, { color: colors.foreground }]}>
                  {selectedLesson.content || selectedLesson.description}
                </Text>
              </ScrollView>
            )}
          </View>

          <View style={[styles.lessonInfo, { backgroundColor: colors.surface }]}>
            <Text style={[styles.lessonInfoTitle, { color: colors.foreground }]}>
              {selectedLesson.title}
            </Text>
            <Text style={[styles.lessonInfoDescription, { color: colors.muted }]}>
              {selectedLesson.description}
            </Text>
            
            <PremiumButton
              onPress={handleLessonComplete}
              variant={getLessonProgress(selectedLesson.id) ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              style={{ marginTop: 16 }}
            >
              <View style={styles.completeButtonContent}>
                {getLessonProgress(selectedLesson.id) && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                )}
                <Text style={{ 
                  color: getLessonProgress(selectedLesson.id) ? colors.primary : '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  {getLessonProgress(selectedLesson.id) ? 'Completed' : 'Mark as Complete'}
                </Text>
              </View>
            </PremiumButton>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: course.title,
          headerBackTitle: 'Courses',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.foreground },
        }}
      />
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Courses', href: '/courses' },
            { label: course.title }
          ]} />

          <Animated.View entering={FadeIn.duration(400)}>
            <Image source={course.thumbnail} style={styles.heroImage} contentFit="cover" />
            
            <View style={styles.headerContent}>
              <View style={[styles.levelBadge, { backgroundColor: `${colors.primary}20` }]}>
                <Text style={[styles.levelText, { color: colors.primary }]}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Text>
              </View>
              
              <Text style={[styles.title, { color: colors.foreground }]}>{course.title}</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>{course.subtitle}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <IconSymbol name="person.fill" size={16} color={colors.muted} />
                  <Text style={[styles.statText, { color: colors.foreground }]}>{course.instructor}</Text>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol name="star.fill" size={16} color={colors.warning} />
                  <Text style={[styles.statText, { color: colors.foreground }]}>{course.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol name="person.fill" size={16} color={colors.muted} />
                  <Text style={[styles.statText, { color: colors.foreground }]}>
                    {course.studentCount.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.muted }]}>Your Progress</Text>
                  <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                    {completionPercentage}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: colors.primary, width: `${completionPercentage}%` }
                    ]} 
                  />
                </View>
                {isComplete && (
                  <Pressable 
                    onPress={() => setShowCertificate(true)}
                    style={[styles.certificateButton, { backgroundColor: `${colors.success}15` }]}
                  >
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                    <Text style={[styles.certificateButtonText, { color: colors.success }]}>
                      View Certificate
                    </Text>
                  </Pressable>
                )}
              </View>

              <Text style={[styles.description, { color: colors.foreground }]}>
                {course.description}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.modulesSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Course Content</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              {course.modules.length} modules • {course.totalDuration} min total
            </Text>

            {course.modules.map((module, moduleIndex) => (
              <Animated.View 
                key={module.id} 
                entering={FadeInDown.delay(moduleIndex * 100).duration(400)}
                style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.moduleHeader}>
                  <View style={[styles.moduleNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.moduleNumberText}>{moduleIndex + 1}</Text>
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={[styles.moduleTitle, { color: colors.foreground }]}>{module.title}</Text>
                    <Text style={[styles.moduleDescription, { color: colors.muted }]}>{module.description}</Text>
                    <Text style={[styles.moduleMeta, { color: colors.muted }]}>
                      {module.lessons.length} lessons • {module.estimatedTime} min
                    </Text>
                  </View>
                </View>

                <View style={[styles.lessonsList, { borderTopColor: colors.border }]}>
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = getLessonProgress(lesson.id);
                    const isLocked = lesson.isPremium && !hasAccess('video-courses');
                    
                    return (
                      <Pressable
                        key={lesson.id}
                        onPress={() => handleLessonPress(lesson)}
                        style={({ pressed }) => [
                          styles.lessonItem,
                          { 
                            backgroundColor: pressed ? colors.border : 'transparent',
                            opacity: isLocked ? 0.6 : 1
                          }
                        ]}
                      >
                        <View style={styles.lessonLeft}>
                          {isCompleted ? (
                            <View style={[styles.lessonCheckmark, { backgroundColor: colors.success }]}>
                              <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                            </View>
                          ) : (
                            <View style={[styles.lessonIndex, { borderColor: colors.border }]}>
                              <Text style={[styles.lessonIndexText, { color: colors.muted }]}>
                                {lessonIndex + 1}
                              </Text>
                            </View>
                          )}
                          <View style={styles.lessonContent}>
                            <Text style={[styles.lessonTitle, { color: colors.foreground }]}>
                              {lesson.title}
                            </Text>
                            <View style={styles.lessonMeta}>
                              <IconSymbol 
                                name={lesson.type === 'video' ? 'play.circle.fill' : 'book.fill'} 
                                size={12} 
                                color={colors.muted} 
                              />
                              <Text style={[styles.lessonDuration, { color: colors.muted }]}>
                                {lesson.duration} min
                              </Text>
                              {!lesson.isPremium && (
                                <View style={[styles.freeBadge, { backgroundColor: `${colors.success}20` }]}>
                                  <Text style={[styles.freeBadgeText, { color: colors.success }]}>FREE</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                        {isLocked ? (
                          <IconSymbol name="lock.fill" size={16} color={colors.muted} />
                        ) : (
                          <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <Modal visible={showCertificate} animationType="fade" transparent>
          <View style={styles.certificateOverlay}>
            <View style={[styles.certificateModal, { backgroundColor: colors.background }]}>
              <View style={[styles.certificateContent, { borderColor: colors.primary }]}>
                <IconSymbol name="checkmark.circle.fill" size={60} color={colors.primary} />
                <Text style={[styles.certificateTitle, { color: colors.foreground }]}>
                  Certificate of Completion
                </Text>
                <Text style={[styles.certificateSubtitle, { color: colors.muted }]}>
                  This certifies that you have successfully completed
                </Text>
                <Text style={[styles.certificateCourse, { color: colors.primary }]}>
                  {course.title}
                </Text>
                <Text style={[styles.certificateInstructor, { color: colors.muted }]}>
                  Instructed by {course.instructor}
                </Text>
                <View style={[styles.certificateDivider, { backgroundColor: colors.border }]} />
                <Text style={[styles.certificateDate, { color: colors.muted }]}>
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              <PremiumButton
                onPress={() => setShowCertificate(false)}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Close</Text>
              </PremiumButton>
            </View>
          </View>
        </Modal>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  heroImage: { width: '100%', height: 200, resizeMode: 'cover' },
  headerContent: { padding: 20 },
  levelBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  levelText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 14, fontWeight: '500' },
  progressSection: { marginBottom: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, fontWeight: '500' },
  progressPercentage: { fontSize: 14, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  certificateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, marginTop: 12 },
  certificateButtonText: { fontSize: 14, fontWeight: '600' },
  description: { fontSize: 15, lineHeight: 24 },
  modulesSection: { padding: 20, paddingTop: 0 },
  sectionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, marginBottom: 16 },
  moduleCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  moduleHeader: { flexDirection: 'row', padding: 16, gap: 12 },
  moduleNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  moduleNumberText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  moduleDescription: { fontSize: 14, marginBottom: 4 },
  moduleMeta: { fontSize: 12 },
  lessonsList: { borderTopWidth: 1 },
  lessonItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  lessonIndex: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  lessonIndexText: { fontSize: 12, fontWeight: '600' },
  lessonCheckmark: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lessonContent: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lessonDuration: { fontSize: 12 },
  freeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  freeBadgeText: { fontSize: 10, fontWeight: '700' },
  playerContainer: { flex: 1 },
  playerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  playerTitle: { fontSize: 17, fontWeight: '600', flex: 1, textAlign: 'center' },
  videoArea: { width: '100%', aspectRatio: 16 / 9 },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  videoPlaceholderText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  videoPlaceholderSubtext: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  articleContent: { flex: 1, backgroundColor: '#FFFFFF' },
  articleContentContainer: { padding: 20 },
  articleText: { fontSize: 16, lineHeight: 26 },
  lessonInfo: { flex: 1, padding: 20 },
  lessonInfoTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  lessonInfoDescription: { fontSize: 15, lineHeight: 24 },
  completeButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certificateOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  certificateModal: { width: '100%', maxWidth: 400, borderRadius: 24, padding: 24 },
  certificateContent: { alignItems: 'center', padding: 24, borderWidth: 2, borderRadius: 16, borderStyle: 'dashed' },
  certificateTitle: { fontSize: 24, fontWeight: '700', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  certificateSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 4 },
  certificateCourse: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginVertical: 12 },
  certificateInstructor: { fontSize: 14, textAlign: 'center' },
  certificateDivider: { width: 60, height: 2, marginVertical: 16 },
  certificateDate: { fontSize: 14 },
});
