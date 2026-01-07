import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type BudgetRange = 'starter' | 'home-barista' | 'serious' | 'prosumer';
export type CoffeePurpose = 'quick-espresso' | 'milk-drinks' | 'pour-over' | 'cold-brew' | 'experimenting' | 'full-setup';

export interface UserProfile {
  hasCompletedOnboarding: boolean;
  experienceLevel: ExperienceLevel | null;
  wantsToBuyEquipment: boolean | null;
  budgetRange: BudgetRange | null;
  coffeePurpose: CoffeePurpose[] | null;
  preferredMachineIds: string[];
  preferredGrinderIds: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

interface UserProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  hasCompletedOnboarding: false,
  experienceLevel: null,
  wantsToBuyEquipment: null,
  budgetRange: null,
  coffeePurpose: null,
  preferredMachineIds: [],
  preferredGrinderIds: [],
  createdAt: null,
  updatedAt: null,
};

const STORAGE_KEY = '@coffee_craft_user_profile';

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from AsyncStorage on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    await saveProfile(newProfile);
  };

  const completeOnboarding = async () => {
    await updateProfile({
      hasCompletedOnboarding: true,
      createdAt: profile.createdAt || new Date().toISOString(),
    });
  };

  const resetProfile = async () => {
    setProfile(defaultProfile);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        completeOnboarding,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}

// Helper functions for recommendations
export function getBudgetLabel(budget: BudgetRange): string {
  const labels: Record<BudgetRange, string> = {
    'starter': 'Getting Started ($100-300)',
    'home-barista': 'Home Barista ($300-700)',
    'serious': 'Serious Setup ($700-1500)',
    'prosumer': 'Prosumer ($1500+)',
  };
  return labels[budget];
}

export function getPurposeLabel(purpose: CoffeePurpose): string {
  const labels: Record<CoffeePurpose, string> = {
    'quick-espresso': 'Quick Morning Espresso',
    'milk-drinks': 'Milk-Based Drinks',
    'pour-over': 'Pour-Over & Filter',
    'cold-brew': 'Cold Brew',
    'experimenting': 'Experimenting',
    'full-setup': 'Full Home Café',
  };
  return labels[purpose];
}

export function getExperienceLabel(level: ExperienceLevel): string {
  const labels: Record<ExperienceLevel, string> = {
    'beginner': 'Just Starting Out',
    'intermediate': 'Home Brewer',
    'advanced': 'Coffee Enthusiast',
  };
  return labels[level];
}
