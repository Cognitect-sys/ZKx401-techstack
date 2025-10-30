import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { wsService } from '../services/websocketService';

export interface DashboardData {
  solanaStats: {
    tps: number;
    blockHeight: number;
    averageSlotTime: number;
    totalTransactions: number;
    feesPerTransaction: number;
  };
  usdcPrice: {
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    lastUpdated: string;
  };
  zkProofStats: {
    proofsGenerated: number;
    successRate: number;
    averageGenerationTime: number;
    activeProvers: number;
  };
  x402Metrics: {
    totalTransactions: number;
    totalVolume: number;
    activeFacilitators: number;
    averageFee: number;
    marketCap: number;
  };
  transactionVolumeHistory: number[];
  liveActivities: Array<{
    id: string;
    type: 'transaction' | 'proof' | 'endpoint' | 'user' | 'api';
    message: string;
    timestamp: string;
    amount?: number;
    address?: string;
  }>;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    solanaStats: {
      tps: 0,
      blockHeight: 0,
      averageSlotTime: 400,
      totalTransactions: 0,
      feesPerTransaction: 0.000005,
    },
    usdcPrice: {
      price: 1.0008,
      change24h: 0.02,
      marketCap: 32000000000,
      volume24h: 5200000000,
      lastUpdated: new Date().toISOString(),
    },
    zkProofStats: {
      proofsGenerated: 0,
      successRate: 99.7,
      averageGenerationTime: 2.3,
      activeProvers: 156,
    },
    x402Metrics: {
      totalTransactions: 0,
      totalVolume: 0,
      activeFacilitators: 23,
      averageFee: 0.003,
      marketCap: 1200000000,
    },
    transactionVolumeHistory: [],
    liveActivities: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initial data fetch
  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        solanaStats,
        usdcPrice,
        zkProofStats,
        x402Metrics,
        transactionHistory,
      ] = await Promise.all([
        apiService.getSolanaNetworkStats(),
        apiService.getUSDCPrice(),
        apiService.getZKProofStats(),
        apiService.getX402Metrics(),
        apiService.getTransactionVolumeHistory(24),
      ]);

      const activities = apiService.generateLiveTransactionActivity();

      setData(prev => ({
        ...prev,
        solanaStats,
        usdcPrice,
        zkProofStats,
        x402Metrics,
        transactionVolumeHistory: transactionHistory,
        liveActivities: activities,
      }));

      setLastUpdate(new Date());
      console.log('Initial data loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time updates
  const startRealTimeUpdates = useCallback(() => {
    console.log('Starting real-time updates...');
    
    // Start mock real-time feed since WebSocket connection to Solana might have CORS issues in browser
    wsService.startMockRealTimeFeed();

    // Handle real-time transactions
    wsService.onMessage('transaction', (transactionData) => {
      setData(prev => ({
        ...prev,
        solanaStats: {
          ...prev.solanaStats,
          tps: Math.floor(Math.random() * 500) + prev.solanaStats.tps, // Simulate TPS increase
          blockHeight: Math.floor(Math.random() * 10) + prev.solanaStats.blockHeight,
          totalTransactions: prev.solanaStats.totalTransactions + 1,
        },
      }));
      console.log('Real-time transaction received:', transactionData);
    });

    // Handle price updates
    wsService.onMessage('price', async (priceData) => {
      setData(prev => ({
        ...prev,
        usdcPrice: priceData,
      }));
      console.log('Real-time price update:', priceData);
    });

    // Handle network stats updates
    wsService.onMessage('stats', async (statsData) => {
      setData(prev => ({
        ...prev,
        solanaStats: statsData,
      }));
      console.log('Real-time stats update:', statsData);
    });

    // Handle activity feed updates
    wsService.onMessage('activity', (activityData) => {
      setData(prev => ({
        ...prev,
        liveActivities: [activityData, ...prev.liveActivities.slice(0, 4)],
      }));
      console.log('New activity:', activityData);
    });
  }, []);

  // Periodic data refresh
  const startPeriodicRefresh = useCallback(() => {
    console.log('Starting periodic data refresh...');

    // Refresh data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [
          solanaStats,
          usdcPrice,
          zkProofStats,
          x402Metrics,
        ] = await Promise.all([
          apiService.getSolanaNetworkStats(),
          apiService.getUSDCPrice(),
          apiService.getZKProofStats(),
          apiService.getX402Metrics(),
        ]);

        setData(prev => ({
          ...prev,
          solanaStats,
          usdcPrice,
          zkProofStats,
          x402Metrics,
        }));

        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error refreshing data:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Initialize dashboard data
  useEffect(() => {
    fetchInitialData().then(() => {
      startRealTimeUpdates();
    });

    const cleanupPeriodic = startPeriodicRefresh();

    return () => {
      wsService.disconnect();
      cleanupPeriodic();
    };
  }, [fetchInitialData, startRealTimeUpdates, startPeriodicRefresh]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refreshData,
    connectionStatus: wsService.getConnectionStatus(),
  };
};

// Hook for real-time price monitoring
export const usePriceMonitoring = () => {
  const [currentPrice, setCurrentPrice] = useState(1.0008);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    // Start price monitoring
    const interval = setInterval(async () => {
      try {
        const priceData = await apiService.getUSDCPrice();
        setCurrentPrice(priceData.price);
        setPriceHistory(prev => [...prev.slice(-23), priceData.price]); // Keep last 24 values
      } catch (error) {
        console.error('Error monitoring price:', error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    currentPrice,
    priceHistory,
    priceChange: priceHistory.length > 1 
      ? ((currentPrice - priceHistory[0]) / priceHistory[0]) * 100 
      : 0,
  };
};

// Hook for network statistics monitoring
export const useNetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState({
    tps: 0,
    blockHeight: 0,
    uptime: 99.8,
    activeValidators: 350,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const stats = await apiService.getSolanaNetworkStats();
        setNetworkStats({
          tps: stats.tps,
          blockHeight: stats.blockHeight,
          uptime: 99.8 + Math.random() * 0.2, // Simulate slight uptime variations
          activeValidators: 350,
        });
      } catch (error) {
        console.error('Error monitoring network:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return networkStats;
};