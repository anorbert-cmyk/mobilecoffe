// Reading Progress Provider
// Tracks article reading progress for the Learn section

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ArticleProgress {
  articleId: string;
  scrollPercentage: number;
  isCompleted: boolean;
  lastReadAt: string;
  readTimeSeconds: number;
}

interface ReadingProgressContextType {
  progress: Record<string, ArticleProgress>;
  updateProgress: (articleId: string, scrollPercentage: number, readTimeSeconds: number) => void;
  markAsCompleted: (articleId: string) => void;
  getProgress: (articleId: string) => ArticleProgress | undefined;
  getCompletedCount: () => number;
  getTotalReadTime: () => number;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);
const STORAGE_KEY = '@coffee_craft_reading_progress';

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, ArticleProgress>>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setProgress(JSON.parse(data));
    });
  }, []);

  const saveProgress = async (newProgress: Record<string, ArticleProgress>) => {
    setProgress(newProgress);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const updateProgress = (articleId: string, scrollPercentage: number, readTimeSeconds: number) => {
    const existing = progress[articleId];
    const newProgress = {
      ...progress,
      [articleId]: {
        articleId,
        scrollPercentage: Math.max(existing?.scrollPercentage || 0, scrollPercentage),
        isCompleted: existing?.isCompleted || scrollPercentage >= 90,
        lastReadAt: new Date().toISOString(),
        readTimeSeconds: (existing?.readTimeSeconds || 0) + readTimeSeconds
      }
    };
    saveProgress(newProgress);
  };

  const markAsCompleted = (articleId: string) => {
    const existing = progress[articleId];
    const newProgress = {
      ...progress,
      [articleId]: {
        articleId,
        scrollPercentage: 100,
        isCompleted: true,
        lastReadAt: new Date().toISOString(),
        readTimeSeconds: existing?.readTimeSeconds || 0
      }
    };
    saveProgress(newProgress);
  };

  const getProgress = (articleId: string) => progress[articleId];

  const getCompletedCount = () => {
    return Object.values(progress).filter(p => p.isCompleted).length;
  };

  const getTotalReadTime = () => {
    return Object.values(progress).reduce((acc, p) => acc + p.readTimeSeconds, 0);
  };

  return (
    <ReadingProgressContext.Provider value={{
      progress,
      updateProgress,
      markAsCompleted,
      getProgress,
      getCompletedCount,
      getTotalReadTime
    }}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

export const useReadingProgress = () => {
  const ctx = useContext(ReadingProgressContext);
  if (!ctx) throw new Error('useReadingProgress must be used within ReadingProgressProvider');
  return ctx;
};
