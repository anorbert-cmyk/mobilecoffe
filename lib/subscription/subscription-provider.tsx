// Subscription Context Provider
// Manages user subscription state, feature access, and 30-day free trial

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SubscriptionTier } from '@/data/subscriptions';
import { hasFeatureAccess } from '@/data/subscriptions';

interface TrialState {
  isTrialActive: boolean;
  trialStartDate: string | null;
  trialEndDate: string | null;
  trialDaysRemaining: number;
  hasUsedTrial: boolean;
}

interface SubscriptionState {
  tier: SubscriptionTier;
  isYearly: boolean;
  expiresAt: string | null;
  isLoading: boolean;
  trial: TrialState;
}

interface SubscriptionContextType extends SubscriptionState {
  setSubscription: (tier: SubscriptionTier, isYearly: boolean, expiresAt?: string) => Promise<void>;
  hasAccess: (feature: string) => boolean;
  isSubscribed: boolean;
  cancelSubscription: () => Promise<void>;
  startTrial: () => Promise<boolean>;
  getTrialStatus: () => TrialState;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY = '@coffee_craft_subscription';
const TRIAL_STORAGE_KEY = '@coffee_craft_trial';
const TRIAL_DURATION_DAYS = 30;

function calculateTrialDaysRemaining(endDate: string | null): number {
  if (!endDate) return 0;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    tier: 'free',
    isYearly: false,
    expiresAt: null,
    isLoading: true,
    trial: {
      isTrialActive: false,
      trialStartDate: null,
      trialEndDate: null,
      trialDaysRemaining: 0,
      hasUsedTrial: false
    }
  });

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const [storedSub, storedTrial] = await Promise.all([
        AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY),
        AsyncStorage.getItem(TRIAL_STORAGE_KEY)
      ]);

      let trialState: TrialState = {
        isTrialActive: false,
        trialStartDate: null,
        trialEndDate: null,
        trialDaysRemaining: 0,
        hasUsedTrial: false
      };

      // Load trial state
      if (storedTrial) {
        const trialData = JSON.parse(storedTrial);
        const daysRemaining = calculateTrialDaysRemaining(trialData.trialEndDate);
        const isActive = daysRemaining > 0 && !trialData.convertedToPaid;
        
        trialState = {
          isTrialActive: isActive,
          trialStartDate: trialData.trialStartDate,
          trialEndDate: trialData.trialEndDate,
          trialDaysRemaining: daysRemaining,
          hasUsedTrial: true
        };
      }

      // Load subscription state
      if (storedSub) {
        const data = JSON.parse(storedSub);
        
        // Check if subscription has expired
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          // Expired - reset to free (but keep trial status)
          await setSubscription('free', false);
          setState(prev => ({
            ...prev,
            tier: 'free',
            isYearly: false,
            expiresAt: null,
            isLoading: false,
            trial: trialState
          }));
        } else {
          setState({
            tier: data.tier || 'free',
            isYearly: data.isYearly || false,
            expiresAt: data.expiresAt || null,
            isLoading: false,
            trial: trialState
          });
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          trial: trialState
        }));
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setSubscription = async (
    tier: SubscriptionTier,
    isYearly: boolean,
    expiresAt?: string
  ) => {
    try {
      const newSubState = {
        tier,
        isYearly,
        expiresAt: expiresAt || null
      };

      await AsyncStorage.setItem(
        SUBSCRIPTION_STORAGE_KEY,
        JSON.stringify(newSubState)
      );

      // If upgrading from trial, mark trial as converted
      if (tier !== 'free' && state.trial.isTrialActive) {
        const trialData = {
          trialStartDate: state.trial.trialStartDate,
          trialEndDate: state.trial.trialEndDate,
          convertedToPaid: true
        };
        await AsyncStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(trialData));
      }

      setState(prev => ({
        ...prev,
        tier,
        isYearly,
        expiresAt: expiresAt || null,
        isLoading: false,
        trial: tier !== 'free' ? {
          ...prev.trial,
          isTrialActive: false
        } : prev.trial
      }));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  };

  const startTrial = async (): Promise<boolean> => {
    // Check if user has already used trial
    if (state.trial.hasUsedTrial) {
      return false;
    }

    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
      
      const trialData = {
        trialStartDate: startDate.toISOString(),
        trialEndDate: endDate.toISOString(),
        convertedToPaid: false
      };

      await AsyncStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(trialData));

      setState(prev => ({
        ...prev,
        trial: {
          isTrialActive: true,
          trialStartDate: trialData.trialStartDate,
          trialEndDate: trialData.trialEndDate,
          trialDaysRemaining: TRIAL_DURATION_DAYS,
          hasUsedTrial: true
        }
      }));

      return true;
    } catch (error) {
      console.error('Failed to start trial:', error);
      return false;
    }
  };

  const cancelSubscription = async () => {
    await setSubscription('free', false);
  };

  const hasAccess = (feature: string): boolean => {
    // If user has active trial, grant Pro-level access
    if (state.trial.isTrialActive) {
      return hasFeatureAccess(feature, 'pro');
    }
    return hasFeatureAccess(feature, state.tier);
  };

  const getTrialStatus = (): TrialState => {
    return {
      ...state.trial,
      trialDaysRemaining: calculateTrialDaysRemaining(state.trial.trialEndDate)
    };
  };

  const isSubscribed = state.tier !== 'free' || state.trial.isTrialActive;

  const value: SubscriptionContextType = {
    ...state,
    setSubscription,
    hasAccess,
    isSubscribed,
    cancelSubscription,
    startTrial,
    getTrialStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
