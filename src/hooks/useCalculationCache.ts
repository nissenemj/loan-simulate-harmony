
import { useState, useCallback } from 'react';
import { PaymentPlan, Debt, PaymentStrategy } from '@/utils/calculator/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  maxAge?: number; // Cache expiration in milliseconds
}

export function useCalculationCache<T>(options: CacheOptions = {}) {
  const { maxAge = 5 * 60 * 1000 } = options; // Default 5 minutes
  const [cache, setCache] = useState<Record<string, CacheEntry<T>>>({});

  const getCachedResult = useCallback((key: string): T | null => {
    const entry = cache[key];
    if (!entry) return null;

    if (maxAge > 0 && Date.now() - entry.timestamp > maxAge) {
      setCache(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
      return null;
    }
    
    return entry.data;
  }, [cache, maxAge]);

  const setCachedResult = useCallback((key: string, data: T) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  const clearCache = useCallback(() => setCache({}), []);

  const generateCacheKey = useCallback((debts: Debt[], payment: number, strategy: PaymentStrategy) => {
    return `${JSON.stringify(debts)}-${payment}-${strategy}`;
  }, []);

  return {
    getCachedResult,
    setCachedResult,
    clearCache,
    generateCacheKey
  };
}
