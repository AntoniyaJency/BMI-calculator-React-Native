import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchase: () => Promise<void>;
  premiumFeatures: {
    weightHistory: boolean;
    bmiProgressChart: boolean;
    calorieRecommendation: boolean;
    dietSuggestions: boolean;
    pdfReports: boolean;
  };
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

const PREMIUM_STATUS_KEY = '@bmi_calculator_premium_status';

interface PremiumFeatures {
  weightHistory: boolean;
  bmiProgressChart: boolean;
  calorieRecommendation: boolean;
  dietSuggestions: boolean;
  pdfReports: boolean;
}

const defaultPremiumFeatures: PremiumFeatures = {
  weightHistory: false,
  bmiProgressChart: false,
  calorieRecommendation: false,
  dietSuggestions: false,
  pdfReports: false,
};

const premiumFeatures: PremiumFeatures = {
  weightHistory: true,
  bmiProgressChart: true,
  calorieRecommendation: true,
  dietSuggestions: true,
  pdfReports: true,
};

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      setIsPremium(stored === 'true');
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePremium = async () => {
    try {
      // In a real app, you would integrate with App Store or Google Play here
      // For demo purposes, we'll simulate a successful purchase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
      setIsPremium(true);
    } catch (error) {
      console.error('Error purchasing premium:', error);
      throw error;
    }
  };

  const restorePurchase = async () => {
    try {
      await loadPremiumStatus();
    } catch (error) {
      console.error('Error restoring purchase:', error);
      throw error;
    }
  };

  const value: PremiumContextType = {
    isPremium,
    isLoading,
    purchasePremium,
    restorePurchase,
    premiumFeatures: isPremium ? premiumFeatures : defaultPremiumFeatures,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
