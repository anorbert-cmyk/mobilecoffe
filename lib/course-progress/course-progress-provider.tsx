import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { courses } from '@/data/courses';

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  startedAt: string;
  completedAt?: string;
}

interface CourseProgressContextType {
  progress: CourseProgress[];
  getProgress: (courseId: string) => CourseProgress | undefined;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getCourseCompletionPercentage: (courseId: string) => number;
  getTotalCompletedLessons: () => number;
  getCompletedCourses: () => string[];
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);
const STORAGE_KEY = '@coffee_craft_course_progress';

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CourseProgress[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setProgress(JSON.parse(data));
    });
  }, []);

  const saveProgress = async (newProgress: CourseProgress[]) => {
    setProgress(newProgress);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const getProgress = (courseId: string) => {
    return progress.find(p => p.courseId === courseId);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    const existing = progress.find(p => p.courseId === courseId);
    
    if (existing) {
      if (!existing.completedLessons.includes(lessonId)) {
        const updated = progress.map(p => {
          if (p.courseId === courseId) {
            const newCompletedLessons = [...p.completedLessons, lessonId];
            
            // Check if course is now complete
            const course = courses.find(c => c.id === courseId);
            const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
            const isComplete = newCompletedLessons.length >= totalLessons;
            
            return {
              ...p,
              completedLessons: newCompletedLessons,
              completedAt: isComplete ? new Date().toISOString() : undefined
            };
          }
          return p;
        });
        saveProgress(updated);
      }
    } else {
      // Start new progress
      saveProgress([
        ...progress,
        {
          courseId,
          completedLessons: [lessonId],
          startedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const getCourseCompletionPercentage = (courseId: string) => {
    const courseProgress = getProgress(courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!course || !courseProgress) return 0;
    
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    
    return Math.round((courseProgress.completedLessons.length / totalLessons) * 100);
  };

  const getTotalCompletedLessons = () => {
    return progress.reduce((acc, p) => acc + p.completedLessons.length, 0);
  };

  const getCompletedCourses = () => {
    return progress
      .filter(p => p.completedAt)
      .map(p => p.courseId);
  };

  return (
    <CourseProgressContext.Provider value={{
      progress,
      getProgress,
      markLessonComplete,
      getCourseCompletionPercentage,
      getTotalCompletedLessons,
      getCompletedCourses
    }}>
      {children}
    </CourseProgressContext.Provider>
  );
}

export const useCourseProgress = () => {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) throw new Error('useCourseProgress must be used within CourseProgressProvider');
  return ctx;
};
