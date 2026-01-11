import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  date: string;
  coffeeName: string;
  brewMethod: string;
  grindSize: string;
  coffeeAmount: number;
  waterAmount: number;
  brewTime: number;
  waterTemp: number;
  rating: number;
  notes: string;
  tastingNotes: string[];
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryById: (id: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);
const STORAGE_KEY = '@coffee_craft_journal';

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setEntries(JSON.parse(data));
    });
  }, []);

  const saveEntries = async (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    await saveEntries([newEntry, ...entries]);
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    await saveEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = async (id: string) => {
    await saveEntries(entries.filter(e => e.id !== id));
  };

  const getEntryById = (id: string) => entries.find(e => e.id === id);

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntryById }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within JournalProvider');
  return ctx;
};
