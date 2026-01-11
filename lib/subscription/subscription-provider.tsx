// Subscription Context Provider
// Manages user subscription state and feature access

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SubscriptionTier } from '@/data/subscriptions';
import { hasFeatureAccess } from '@/data/subscriptions';

interface SubscriptionState {
  tier: SubscriptionTier;
  isYearly: boolean;
  expiresAt: string | null;
  isLoading: boolean;
}

interface SubscriptionContextType extends SubscriptionState {
  setSubscription: (tier: SubscriptionTier, isYearly: boolean, expiresAt?: string) => Promise<void>;
  hasAccess: (feature: string) => boolean;
  isSubscribed: boolean;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY = '@coffee_craft_subscription';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    tier: 'free',
    isYearly: false,
    expiresAt: null,
    isLoading: true
  });

  // Load subscription from AsyncStorage on mount
  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check if subscription has expired
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          // Expired - reset to free
          await setSubscription('free', false);
        } else {
          setState({
            tier: data.tier || 'free',
            isYearly: data.isYearly || false,
            expiresAt: data.expiresAt || null,
            isLoading: false
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
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
      const newState: SubscriptionState = {
        tier,
        isYearly,
        expiresAt: expiresAt || null,
        isLoading: false
      };

      await AsyncStorage.setItem(
        SUBSCRIPTION_STORAGE_KEY,
        JSON.stringify(newState)
      );

      setState(newState);
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  };

  const cancelSubscription = async () => {
    await setSubscription('free', false);
  };

  const hasAccess = (feature: string): boolean => {
    return hasFeatureAccess(feature, state.tier);
  };

  const isSubscribed = state.tier !== 'free';

  const value: SubscriptionContextType = {
    ...state,
    setSubscription,
    hasAccess,
    isSubscribed,
    cancelSubscription
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
