import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NetworkMetrics, Activity, FilterOptions, SortConfig } from '../types/dashboard';

interface UseOptimizedDashboardOptions {
  refreshInterval?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  enableCaching?: boolean;
  cacheTimeout?: number;
}

interface UseOptimizedDashboardReturn {
  data: NetworkMetrics | null;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  exportData: (format: 'csv' | 'json' | 'xlsx') => void;
  applyFilters: (filters: FilterOptions) => void;
  sortData: (config: SortConfig) => void;
  isConnected: boolean;
}

export const useOptimizedDashboard = (
  options: UseOptimizedDashboardOptions = {}
): UseOptimizedDashboardReturn => {
  const {
    refreshInterval = 30000,
    enableRetry = true,
    maxRetries = 3,
    retryDelay = 1000,
    enableCaching = true,
    cacheTimeout = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [data, setData] = useState<NetworkMetrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Mock API data generator - replace with real API calls
  const fetchDashboardData = useCallback(async (): Promise<NetworkMetrics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      throw new Error('Network timeout');
    }

    return {
      solanaStats: {
        tps: Math.floor(Math.random() * 1000) + 2000,
        feesPerTransaction: (Math.random() * 0.001 + 0.0001).toFixed(6),
        blockHeight: Math.floor(Math.random() * 1000000) + 280000000
      },
      x402Metrics: {
        totalTransactions: Math.floor(Math.random() * 100000) + 50000,
        activeFacilitators: Math.floor(Math.random() * 100) + 45,
        marketCap: `$${(Math.random() * 50 + 10).toFixed(1)}M`,
        totalVolume: Math.random() * 10000000 + 5000000,
        averageFee: 0.1
      },
      zkProofStats: {
        proofsGenerated: Math.floor(Math.random() * 1000) + 500,
        successRate: (Math.random() * 2 + 98).toFixed(1),
        averageGenerationTime: (Math.random() * 3 + 1).toFixed(1)
      },
      usdcPrice: {
        current: 0.999847 + (Math.random() - 0.5) * 0.001,
        change24h: (Math.random() - 0.5) * 0.01,
        change24hPercent: (Math.random() - 0.5) * 0.5
      },
      transactionVolumeHistory: Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 50000) + 20000
      )
    };
  }, []);

  const fetchActivities = useCallback(async (): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const activityTypes: Activity['type'][] = ['transaction', 'proof', 'endpoint', 'user', 'api'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `activity-${Date.now()}-${i}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      message: `New ${activityTypes[Math.floor(Math.random() * activityTypes.length)]} activity recorded`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      metadata: {
        amount: Math.random() * 1000,
        facilitator: ['PayAI', 'Daydreams', 'AurraCloud', 'ZKx401'][Math.floor(Math.random() * 4)],
        userId: `user-${Math.floor(Math.random() * 10000)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
      }
    }));
  }, []);

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      if (!isRetry) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);
      setIsConnected(true);

      const [networkData, activityData] = await Promise.all([
        fetchDashboardData(),
        fetchActivities()
      ]);

      setData(networkData);
      setActivities(activityData);
      setLastUpdated(new Date());
      retryCountRef.current = 0;

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      if (enableRetry && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff
        
        timeoutRef.current = setTimeout(() => {
          fetchData(true);
        }, delay);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchDashboardData, fetchActivities, enableRetry, maxRetries, retryDelay]);

  // Manual refresh
  const refresh = useCallback(async () => {
    if (!isRefreshing) {
      await fetchData(false);
    }
  }, [fetchData, isRefreshing]);

  // Retry function
  const retry = useCallback(async () => {
    retryCountRef.current = 0;
    await fetchData(false);
  }, [fetchData]);

  // Export data functionality
  const exportData = useCallback((format: 'csv' | 'json' | 'xlsx') => {
    if (!data) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `zkx401-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        // Convert to CSV format
        const csvRows = [
          'Metric,Value',
          `Solana TPS,${data.solanaStats.tps}`,
          `Gas Fee,${data.solanaStats.feesPerTransaction}`,
          `Block Height,${data.solanaStats.blockHeight}`,
          `x402 Transactions,${data.x402Metrics.totalTransactions}`,
          `Active Facilitators,${data.x402Metrics.activeFacilitators}`,
          `Market Cap,${data.x402Metrics.marketCap}`,
          `USDC Price,${data.usdcPrice.current}`
        ];
        content = csvRows.join('\n');
        filename = `zkx401-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data]);

  // Apply filters
  const applyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // Sort data
  const sortData = useCallback((config: SortConfig) => {
    setSortConfig(config);
  }, []);

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Apply filters
    if (filters.dateRange) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= filters.dateRange!.start && activityDate <= filters.dateRange!.end;
      });
    }

    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      filtered = filtered.filter(activity => 
        filters.transactionTypes!.includes(activity.type)
      );
    }

    if (filters.amountRange) {
      filtered = filtered.filter(activity => 
        activity.metadata?.amount && 
        activity.metadata.amount >= filters.amountRange!.min &&
        activity.metadata.amount <= filters.amountRange!.max
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal: any, bVal: any;

        switch (sortConfig.key) {
          case 'timestamp':
            aVal = new Date(a.timestamp).getTime();
            bVal = new Date(b.timestamp).getTime();
            break;
          case 'type':
            aVal = a.type;
            bVal = b.type;
            break;
          case 'amount':
            aVal = a.metadata?.amount || 0;
            bVal = b.metadata?.amount || 0;
            break;
          default:
            return 0;
        }

        if (sortConfig.direction === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [activities, filters, sortConfig]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData(true);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    activities: filteredActivities,
    isLoading,
    error,
    isRefreshing,
    lastUpdated,
    refresh,
    retry,
    exportData,
    applyFilters,
    sortData,
    isConnected
  };
};

export default useOptimizedDashboard;