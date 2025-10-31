import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, Shield, Users, Zap, Code, AlertCircle, Search, Filter, RefreshCw, Download, ChevronDown, MoreVertical } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useActivitySearch } from '../../hooks/useSearch';
import { Activity as ActivityType, FilterOptions } from '../../types/dashboard';

interface ActivityFeedProps {
  enableSearch?: boolean;
  enableFiltering?: boolean;
  enableRealTime?: boolean;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  enableSearch = true, 
  enableFiltering = true, 
  enableRealTime = true,
  maxItems = 100
}) => {
  // Mock activities data for demo
  const [mockActivities] = useState<ActivityType[]>(() => 
    Array.from({ length: 200 }, (_, i) => ({
      id: `activity-${i}`,
      type: ['transaction', 'proof', 'endpoint', 'user', 'api'][Math.floor(Math.random() * 5)] as ActivityType['type'],
      message: `Activity ${i}: New ${['transaction', 'proof', 'endpoint', 'user', 'api'][Math.floor(Math.random() * 5)]} recorded`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      metadata: {
        amount: Math.random() * 1000,
        facilitator: ['PayAI', 'Daydreams', 'AurraCloud', 'ZKx401'][Math.floor(Math.random() * 4)],
        userId: `user-${Math.floor(Math.random() * 10000)}`
      }
    }))
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [revenue] = useState(25000);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Use infinite scroll for activities
  const {
    items: activities,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    isRefreshing,
    scrollRef,
    setEnableRealTime
  } = useInfiniteScroll(mockActivities, {
    initialSize: 20,
    incrementSize: 10,
    maxSize: maxItems,
    enableRealTime
  });

  // Use search functionality
  const {
    searchTerm,
    setSearchTerm,
    results: filteredActivities,
    isSearching,
    hasResults,
    resultCount
  } = useActivitySearch(activities);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced filtering UI
  const FilterPanel = useCallback(() => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Activity Filters</h4>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Types</label>
                <select multiple className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                  <option value="transaction">Transaction</option>
                  <option value="proof">Proof</option>
                  <option value="endpoint">Endpoint</option>
                  <option value="user">User</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Facilitator</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-cyan">
                  <option value="all">All Facilitators</option>
                  <option value="zkx401">ZKx401</option>
                  <option value="payai">PayAI</option>
                  <option value="daydreams">Daydreams</option>
                  <option value="aurra">AurraCloud</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Real-time Updates</label>
                <button
                  onClick={() => setEnableRealTime(!enableRealTime)}
                  className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                    enableRealTime 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  {enableRealTime ? '● Live' : '○ Paused'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ), [showFilters, enableRealTime, setEnableRealTime]);

  // Search interface
  const SearchInterface = useCallback(() => (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search activities, types, or facilitators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent"
        />
        {isSearching && (
          <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent-cyan w-4 h-4 animate-spin" />
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 text-xs text-gray-600">
          {hasResults ? `${resultCount} results found` : 'No results found'}
        </div>
      )}
    </div>
  ), [searchTerm, isSearching, hasResults, resultCount]);

  // Helper function to format activity data
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <TrendingUp className="w-4 h-4" />;
      case 'proof':
        return <Shield className="w-4 h-4" />;
      case 'endpoint':
        return <Zap className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'api':
        return <Code className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'accent-cyan';
      case 'proof':
        return 'accent-purple';
      case 'endpoint':
        return 'accent-green';
      case 'user':
        return 'accent-cyan';
      case 'api':
        return 'accent-purple';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  const RevenueCalculator: React.FC = () => {
    const [txVolume, setTxVolume] = useState(10000);
    const [avgAmount, setAvgAmount] = useState(100);

    const estimatedRevenue = (txVolume * 0.1); // 0.1 USDC fixed fee per transaction

    return (
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent-green/10 text-accent-green">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-h3 font-semibold text-text-primary">Revenue Calculator</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Monthly Transactions</label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={txVolume}
              onChange={(e) => setTxVolume(Number(e.target.value))}
              className="w-full h-2 bg-bg-hover rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-text-primary font-mono mt-1">
              {txVolume.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Average Transaction Amount</label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={avgAmount}
              onChange={(e) => setAvgAmount(Number(e.target.value))}
              className="w-full h-2 bg-bg-hover rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-text-primary font-mono mt-1">
              ${avgAmount}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 border border-accent-green/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-green mb-1">
                ${estimatedRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-text-secondary">Estimated Monthly Revenue</div>
              <div className="text-xs text-text-tertiary mt-2">
                Based on 0.1 USDC fixed fee per transaction
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <section id="integration" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-700 rounded-lg w-80 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state (removed as no error handling is implemented)

  return (
    <section id="integration" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            Live Network Activity
          </div>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            Real-Time Activity Feed
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Live updates dari ZKx401 network dengan real-time transaction monitoring, 
            proof generation, dan integration status.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <motion.div
            className="lg:col-span-2 stat-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="live-indicator" />
                <h3 className="text-h3 font-semibold text-text-primary">Live Activity Stream</h3>
              </div>
              <div className="text-xs text-text-tertiary">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            {enableSearch && <SearchInterface />}
            {enableFiltering && <FilterPanel />}
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {(searchTerm ? filteredActivities : activities).map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-bg-hover/50 hover:bg-bg-hover transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg bg-${getActivityColor(activity.type)}/10 text-${getActivityColor(activity.type)} mt-1`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.message }} />
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-tertiary">{formatTimestamp(activity.timestamp)}</span>
                        <div className="w-1 h-1 rounded-full bg-text-tertiary" />
                        <span className="text-xs text-text-tertiary capitalize">{activity.type}</span>
                        {activity.metadata?.facilitator && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-text-tertiary" />
                            <span className="text-xs text-text-tertiary">{activity.metadata.facilitator}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Infinite scroll trigger */}
              <div ref={scrollRef} className="h-10 flex items-center justify-center">
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 ${isLoading ? 'animate-bounce' : ''}`} />
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Revenue Calculator */}
            <RevenueCalculator />

            {/* API Integration CTA */}
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="p-4 rounded-xl bg-accent-cyan/10 text-accent-cyan w-fit mx-auto mb-4">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="text-h3 font-semibold text-text-primary mb-3">
                  Integrate ZKx401 API
                </h3>
                <p className="text-text-secondary text-sm mb-6">
                  Start building dengan ZKx401 API untuk payment processing, 
                  ZK proof generation, dan network monitoring.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="text-xs text-text-tertiary bg-bg-hover/50 p-2 rounded font-mono">
                    npm install @zkx401/sdk
                  </div>
                </div>

                <motion.button
                  className="w-full px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Integration
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;