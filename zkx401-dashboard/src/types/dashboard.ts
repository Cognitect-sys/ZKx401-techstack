// Dashboard Types - Professional Level
export interface NetworkStats {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeType: 'positive' | 'negative' | 'neutral';
  showLiveIndicator?: boolean;
  icon?: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  timestamp?: string;
}

export interface NetworkMetrics {
  solanaStats: {
    tps: number;
    feesPerTransaction: string;
    blockHeight: number;
  };
  x402Metrics: {
    totalTransactions: number;
    activeFacilitators: number;
    marketCap: string;
    totalVolume: number;
    averageFee: number;
  };
  zkProofStats: {
    proofsGenerated: number;
    successRate: string;
    averageGenerationTime: string;
  };
  usdcPrice: {
    current: number;
    change24h: number;
    change24hPercent: number;
  };
  transactionVolumeHistory: number[];
}

export interface Activity {
  id: string;
  type: 'transaction' | 'proof' | 'endpoint' | 'user' | 'api' | 'system';
  message: string;
  timestamp: string;
  metadata?: {
    amount?: number;
    fee?: number;
    facilitator?: string;
    userId?: string;
    transactionHash?: string;
  };
}

export interface FacilitatorData {
  name: string;
  marketCap: string;
  activeWallets: string;
  transactionFee: string;
  trustScore: number;
  privacyLevel: 'High' | 'Medium' | 'Low';
  apiEndpoints: number;
  uptime: string;
  zkx401: boolean;
  marketCapTrend?: number;
  performanceScore?: number;
}

export interface CompetitiveAdvantage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  metrics?: {
    value: string;
    label: string;
    improvement?: string;
  };
  demonstrations?: {
    type: 'interactive' | 'calculator' | 'comparison';
    data: any;
  };
}

export interface PaymentFlowStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp?: string;
  duration?: number;
}

export interface RoutingMetrics {
  avgProcessingTime: string;
  successRate: string;
  routingFee: string;
  volume24h?: number;
  activeRoutes?: number;
}

export interface DataExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeCharts?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  metrics?: string[];
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  transactionTypes?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  facilitators?: string[];
  privacyLevels?: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  chartType: 'line' | 'bar' | 'area';
  refreshInterval: number;
  notifications: {
    priceAlerts: boolean;
    transactionAlerts: boolean;
    systemAlerts: boolean;
  };
  keyboardShortcuts: boolean;
  compactMode: boolean;
}

export interface ComponentState {
  isLoading: boolean;
  error: string | null;
  data: any;
  lastUpdated: Date;
  isRefreshing: boolean;
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundary: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

export interface LoadingState {
  skeleton: boolean;
  spinner: boolean;
  progress: number;
  message?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ComparisonMode {
  enabled: boolean;
  selectedItems: string[];
  comparisonMetrics: string[];
}