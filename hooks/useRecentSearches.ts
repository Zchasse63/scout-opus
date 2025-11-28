/**
 * Hook for managing recent searches with AsyncStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@scout/recent_searches';
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
  type: 'text' | 'voice';
}

// Popular/suggested searches
export const POPULAR_SEARCHES = [
  'CrossFit near me',
  'Gyms with pools',
  '24 hour gyms',
  'Yoga studios',
  'Gyms under $20',
];

// Time-based suggestions
export function getTimeSuggestions(): string[] {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return ['Morning workout spots', 'Gyms open early'];
  } else if (hour >= 11 && hour < 14) {
    return ['Lunch break workouts', 'Quick gym sessions'];
  } else if (hour >= 17 && hour < 21) {
    return ['After work gyms', 'Evening classes'];
  }
  return ['24 hour gyms', 'Late night fitness'];
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent searches from storage
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecentSearch = useCallback(async (query: string, type: 'text' | 'voice' = 'text') => {
    if (!query.trim()) return;

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
      type,
    };

    setRecentSearches((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
      // Add new search at the beginning
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      // Persist to storage
      AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback(async (id: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }, []);

  return {
    recentSearches,
    isLoading,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    popularSearches: POPULAR_SEARCHES,
    timeSuggestions: getTimeSuggestions(),
  };
}

export default useRecentSearches;

