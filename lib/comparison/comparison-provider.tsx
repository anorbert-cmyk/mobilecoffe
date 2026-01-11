import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ComparisonItem = { id: string; type: 'machine' | 'grinder' };

interface ComparisonContextType {
  items: ComparisonItem[];
  addItem: (item: ComparisonItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInComparison: (id: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
const STORAGE_KEY = '@coffee_craft_comparison';
const MAX_ITEMS = 3;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setItems(JSON.parse(data));
    });
  }, []);

  const saveItems = async (newItems: ComparisonItem[]) => {
    setItems(newItems);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const addItem = (item: ComparisonItem) => {
    if (items.length < MAX_ITEMS && !items.find(i => i.id === item.id)) {
      saveItems([...items, item]);
    }
  };

  const removeItem = (id: string) => saveItems(items.filter(i => i.id !== id));
  const clearAll = () => saveItems([]);
  const isInComparison = (id: string) => items.some(i => i.id === id);
  const canAddMore = items.length < MAX_ITEMS;

  return (
    <ComparisonContext.Provider value={{ items, addItem, removeItem, clearAll, isInComparison, canAddMore }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error('useComparison must be used within ComparisonProvider');
  return ctx;
};
