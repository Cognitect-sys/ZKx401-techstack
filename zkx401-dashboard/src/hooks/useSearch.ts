import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Activity, FacilitatorData } from '../types/dashboard';

interface UseSearchOptions {
  debounceMs?: number;
  minSearchLength?: number;
  highlightMatches?: boolean;
  caseSensitive?: boolean;
}

interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: T[];
  isSearching: boolean;
  clearSearch: () => void;
  hasResults: boolean;
  resultCount: number;
  suggestions: string[];
  searchHistory: string[];
  highlightedResults: T[];
}

export function useSearch<T extends { [key: string]: any }>(
  items: T[],
  searchFields: (keyof T)[],
  options: UseSearchOptions = {}
): UseSearchReturn<T> {
  const {
    debounceMs = 300,
    minSearchLength = 2,
    highlightMatches = true,
    caseSensitive = false
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearchTerm = useMemo(() => {
    return searchTerm;
  }, [searchTerm]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  // Generate suggestions based on search term
  const suggestions = useMemo(() => {
    if (debouncedSearchTerm.length < minSearchLength) return [];

    const allValues = items.flatMap(item => 
      searchFields.map(field => String(item[field] || '').toLowerCase())
    );

    const uniqueValues = Array.from(new Set(allValues))
      .filter(value => value.includes(debouncedSearchTerm.toLowerCase()))
      .slice(0, 5);

    return uniqueValues;
  }, [items, searchFields, debouncedSearchTerm, minSearchLength]);

  // Filter items based on search term
  const filteredResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minSearchLength) {
      return items;
    }

    const searchLower = caseSensitive ? debouncedSearchTerm : debouncedSearchTerm.toLowerCase();

    return items.filter(item => {
      return searchFields.some(field => {
        const fieldValue = String(item[field] || '');
        return caseSensitive 
          ? fieldValue.includes(debouncedSearchTerm)
          : fieldValue.toLowerCase().includes(searchLower);
      });
    });
  }, [items, searchFields, debouncedSearchTerm, minSearchLength, caseSensitive]);

  // Highlight search matches
  const highlightedResults = useMemo(() => {
    if (!highlightMatches || !debouncedSearchTerm || debouncedSearchTerm.length < minSearchLength) {
      return filteredResults;
    }

    return filteredResults.map(item => {
      const highlightedItem = { ...item };
      
      searchFields.forEach(field => {
        const fieldValue = String(item[field] || '');
        const regex = new RegExp(`(${debouncedSearchTerm})`, caseSensitive ? 'g' : 'gi');
        
        if (regex.test(fieldValue)) {
          // Store original value and highlighted version
          (highlightedItem as any)[field] = fieldValue.replace(
            regex,
            '<mark class="bg-accent-cyan/20 text-accent-cyan font-medium">$1</mark>'
          );
        }
      });

      return highlightedItem;
    });
  }, [filteredResults, searchFields, debouncedSearchTerm, minSearchLength, highlightMatches, caseSensitive]);

  // Handle search term changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debouncedSearchTerm, debounceMs]);

  // Add to search history
  useEffect(() => {
    if (debouncedSearchTerm.length >= minSearchLength) {
      setSearchHistory(prev => {
        const newHistory = [debouncedSearchTerm, ...prev.filter(h => h !== debouncedSearchTerm)];
        return newHistory.slice(0, 10); // Keep last 10 searches
      });
    }
  }, [debouncedSearchTerm, minSearchLength]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results: filteredResults,
    isSearching,
    clearSearch,
    hasResults: filteredResults.length > 0,
    resultCount: filteredResults.length,
    suggestions,
    searchHistory,
    highlightedResults
  };
}

// Specialized hooks for specific types
export function useActivitySearch(activities: Activity[]) {
  // Custom search function to handle nested properties
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const filteredResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 3) return activities;
    
    const searchLower = searchTerm.toLowerCase();
    return activities.filter(activity => 
      activity.message.toLowerCase().includes(searchLower) ||
      activity.type.toLowerCase().includes(searchLower) ||
      (activity.metadata?.facilitator?.toLowerCase().includes(searchLower) ?? false)
    );
  }, [activities, searchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    results: filteredResults,
    isSearching,
    hasResults: filteredResults.length > 0,
    resultCount: filteredResults.length
  };
}

export function useFacilitatorSearch(facilitators: FacilitatorData[]) {
  return useSearch(facilitators, ['name', 'privacyLevel'], {
    debounceMs: 200,
    minSearchLength: 2,
    highlightMatches: true
  });
}

export default useSearch;