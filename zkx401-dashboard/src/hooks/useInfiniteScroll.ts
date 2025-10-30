import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Activity } from '../types/dashboard';

interface UseInfiniteScrollOptions {
  initialSize?: number;
  incrementSize?: number;
  maxSize?: number;
  threshold?: number;
  enableRealTime?: boolean;
}

interface UseInfiniteScrollReturn {
  items: Activity[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  isRefreshing: boolean;
  totalCount: number;
  error: string | null;
  scrollRef: (node: HTMLElement | null) => void;
  setEnableRealTime: (enabled: boolean) => void;
}

export const useInfiniteScroll = (
  initialActivities: Activity[] = [],
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    initialSize = 20,
    incrementSize = 10,
    maxSize = 1000,
    threshold = 0.8,
    enableRealTime = true
  } = options;

  const [items, setItems] = useState<Activity[]>(initialActivities);
  const [displayCount, setDisplayCount] = useState(initialSize);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialActivities.length > initialSize);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(initialActivities.length);
  const [error, setError] = useState<string | null>(null);
  const [enableRealTimeUpdates, setEnableRealTimeUpdates] = useState(enableRealTime);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate API delay
    timeoutRef.current = setTimeout(() => {
      const newCount = Math.min(displayCount + incrementSize, maxSize);
      const newItems = initialActivities.slice(0, newCount);
      
      setItems(newItems);
      setDisplayCount(newCount);
      setHasMore(newCount < initialActivities.length);
      setIsLoading(false);
      setError(null);
    }, 500);
  }, [isLoading, hasMore, displayCount, incrementSize, maxSize, initialActivities]);

  // Refresh data
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setDisplayCount(initialSize);
    setHasMore(initialActivities.length > initialSize);
    
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      setItems(initialActivities.slice(0, initialSize));
      setTotalCount(initialActivities.length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  }, [initialActivities, initialSize]);

  // Set up intersection observer
  const scrollRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        entries => {
          const target = entries[0];
          if (target.isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        },
        {
          threshold,
          rootMargin: '50px'
        }
      );

      observerRef.current.observe(node);
    }
  }, [loadMore, hasMore, isLoading, threshold]);

  // Real-time updates
  useEffect(() => {
    if (!enableRealTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: ['transaction', 'proof', 'endpoint', 'user', 'api'][Math.floor(Math.random() * 5)] as Activity['type'],
        message: `New real-time ${['transaction', 'proof', 'endpoint', 'user', 'api'][Math.floor(Math.random() * 5)]} activity`,
        timestamp: new Date().toISOString(),
        metadata: {
          amount: Math.random() * 1000,
          facilitator: ['PayAI', 'Daydreams', 'AurraCloud', 'ZKx401'][Math.floor(Math.random() * 4)],
          userId: `user-${Math.floor(Math.random() * 10000)}`
        }
      };

      setItems(prev => [newActivity, ...prev.slice(0, displayCount - 1)]);
      setTotalCount(prev => prev + 1);
    }, 5000 + Math.random() * 10000); // Random interval 5-15 seconds

    return () => clearInterval(interval);
  }, [enableRealTimeUpdates, displayCount]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Memoized items for performance
  const displayedItems = useMemo(() => items, [items]);

  return {
    items: displayedItems,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    isRefreshing,
    totalCount,
    error,
    scrollRef,
    setEnableRealTime: setEnableRealTimeUpdates
  };
};

export default useInfiniteScroll;