import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Clock, Zap, Award, ArrowUpDown, Download, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { FacilitatorData, SortConfig, ComparisonMode } from '../../types/dashboard';

interface FacilitatorComparisonProps {
  enableSorting?: boolean;
  enableExport?: boolean;
  enableCompareMode?: boolean;
}

const FacilitatorComparison: React.FC<FacilitatorComparisonProps> = ({ 
  enableSorting = true, 
  enableExport = true, 
  enableCompareMode = true 
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'trustScore', direction: 'desc' });
  const [compareMode, setCompareMode] = useState<ComparisonMode>({ enabled: false, selectedItems: [], comparisonMetrics: ['trustScore', 'transactionFee'] });
  const [showMarketTrends, setShowMarketTrends] = useState(true);
  const [comparisonMetrics, setComparisonMetrics] = useState<string[]>(['trustScore', 'transactionFee', 'activeWallets']);

  const facilitators: FacilitatorData[] = useMemo(() => [
    {
      name: 'PayAI',
      marketCap: '$48M',
      activeWallets: '89K',
      transactionFee: '45bps',
      trustScore: 4.2,
      privacyLevel: 'Medium',
      apiEndpoints: 12,
      uptime: '99.2%',
      zkx401: false,
      marketCapTrend: 5.2,
      performanceScore: 82
    },
    {
      name: 'Daydreams',
      marketCap: '$16M',
      activeWallets: '34K',
      transactionFee: '50bps',
      trustScore: 3.8,
      privacyLevel: 'Low',
      apiEndpoints: 8,
      uptime: '97.8%',
      zkx401: false,
      marketCapTrend: -2.1,
      performanceScore: 68
    },
    {
      name: 'AurraCloud',
      marketCap: '$23M',
      activeWallets: '56K',
      transactionFee: '40bps',
      trustScore: 4.0,
      privacyLevel: 'Medium',
      apiEndpoints: 15,
      uptime: '98.9%',
      zkx401: false,
      marketCapTrend: 8.7,
      performanceScore: 78
    },
    {
      name: 'ZKx401',
      marketCap: '$12M',
      activeWallets: '37K',
      transactionFee: '30bps',
      trustScore: 4.9,
      privacyLevel: 'High',
      apiEndpoints: 18,
      uptime: '99.8%',
      zkx401: true,
      marketCapTrend: 15.3,
      performanceScore: 94
    }
  ], []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const exportData = useCallback(() => {
    const csvData = facilitators.map(f => ({
      Facilitator: f.name,
      'Market Cap': f.marketCap,
      'Active Wallets': f.activeWallets,
      'Transaction Fee': f.transactionFee,
      'Trust Score': f.trustScore,
      'Privacy Level': f.privacyLevel,
      'API Endpoints': f.apiEndpoints,
      'Uptime': f.uptime,
      'Market Cap Trend': f.marketCapTrend
    }));
    
    const csvContent = Object.keys(csvData[0]).join(',') + '\n' + 
      csvData.map(row => Object.values(row).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zkx401-facilitator-comparison.csv';
    a.click();
  }, [facilitators]);

  const getPrivacyBadgeColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'Medium':
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      case 'Low':
        return 'bg-accent-red/20 text-accent-red border-accent-red/30';
      default:
        return 'bg-text-tertiary/20 text-text-tertiary border-text-tertiary/30';
    }
  };

  const getUptimeColor = (uptime: string) => {
    const num = parseFloat(uptime.replace('%', ''));
    if (num >= 99) return 'text-accent-green';
    if (num >= 98) return 'text-accent-orange';
    return 'text-accent-red';
  };

  const renderTrustScore = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-accent-orange text-accent-orange" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-accent-orange/50 text-accent-orange" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-text-tertiary" />
        );
      }
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex">{stars}</div>
        <span className="text-sm font-mono text-text-secondary">{score}</span>
      </div>
    );
  };

  return (
    <section id="comparison" className="py-20 bg-bg-near-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Competitive Analysis
            {showMarketTrends && <span className="ml-2">• Trends</span>}
          </div>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            x402 Facilitator Ecosystem
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-8">
            Comprehensive comparison of leading x402 facilitators dalam $30T facilitator market. 
            ZKx401 positioned sebagai privacy-first, cost-effective solution.
          </p>
          
          {/* Market Size Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/20"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-5 h-5 text-accent-cyan" />
            <span className="text-text-primary font-semibold">Market Opportunity:</span>
            <span className="text-accent-cyan font-bold text-lg">$30 Trillion</span>
          </motion.div>
        </motion.div>

        {/* Export & Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {enableExport && (
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            )}
            <button
              onClick={() => setShowMarketTrends(!showMarketTrends)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showMarketTrends 
                  ? 'bg-accent-purple text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Market Trends
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-bg-hover rounded-lg overflow-hidden border border-white/10">
          {/* Table Header */}
          <div className="bg-bg-hover border-b border-white/10 p-6">
            <h3 className="text-h3 font-semibold text-text-primary">Facilitator Comparison Matrix</h3>
            <p className="text-text-secondary mt-2">Comprehensive metrics untuk competitive analysis</p>
          </div>
          <div className="bg-bg-hover border-b border-white/10 p-6">
            <h3 className="text-h3 font-semibold text-text-primary">Facilitator Comparison Matrix</h3>
            <p className="text-text-secondary mt-2">Comprehensive metrics untuk competitive analysis</p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-text-secondary font-semibold">
                    <button
                      onClick={() => enableSorting && handleSort('name')}
                      className="flex items-center gap-1 hover:text-accent-purple transition-colors"
                    >
                      Facilitator
                      {enableSorting && <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="text-right p-6 text-text-secondary font-semibold">
                    <button
                      onClick={() => enableSorting && handleSort('marketCap')}
                      className="flex items-center gap-1 hover:text-accent-purple transition-colors ml-auto"
                    >
                      Market Cap
                      {enableSorting && <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="text-right p-6 text-text-secondary font-semibold">Active Wallets</th>
                  <th className="text-right p-6 text-text-secondary font-semibold">Transaction Fee</th>
                  <th className="text-center p-6 text-text-secondary font-semibold">Trust Score</th>
                  <th className="text-center p-6 text-text-secondary font-semibold">Privacy Level</th>
                  <th className="text-right p-6 text-text-secondary font-semibold">API Endpoints</th>
                  <th className="text-right p-6 text-text-secondary font-semibold">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {facilitators.map((facilitator, index) => (
                  <motion.tr
                    key={facilitator.name}
                    className={`border-b border-white/5 transition-all duration-200 ${
                      facilitator.zkx401 
                        ? 'bg-accent-purple/5 border-l-3 border-l-accent-purple' 
                        : 'hover:bg-bg-hover'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Facilitator Name */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          facilitator.zkx401 
                            ? 'bg-accent-purple/20 text-accent-purple' 
                            : 'bg-accent-cyan/10 text-accent-cyan'
                        }`}>
                          {facilitator.zkx401 ? <Shield className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className={`font-semibold ${
                            facilitator.zkx401 ? 'text-accent-purple' : 'text-text-primary'
                          }`}>
                            {facilitator.name}
                          </span>
                          {facilitator.zkx401 && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full">
                                LEADER
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Market Cap */}
                    <td className="text-right p-6 font-mono text-text-primary">
                      <div className="flex items-center gap-2 justify-end">
                        {facilitator.marketCap}
                        {showMarketTrends && facilitator.marketCapTrend && (
                          <div className={`flex items-center gap-1 text-xs ${
                            facilitator.marketCapTrend >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {facilitator.marketCapTrend >= 0 ? '↗' : '↘'}
                            {Math.abs(facilitator.marketCapTrend).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Active Wallets */}
                    <td className="text-right p-6 font-mono text-text-primary">
                      {facilitator.activeWallets}
                    </td>

                    {/* Transaction Fee */}
                    <td className="text-right p-6">
                      <span className={`font-mono ${
                        facilitator.transactionFee === '30bps' ? 'text-accent-green' : 'text-text-primary'
                      }`}>
                        {facilitator.transactionFee}
                      </span>
                    </td>

                    {/* Trust Score */}
                    <td className="text-center p-6">
                      {renderTrustScore(facilitator.trustScore)}
                    </td>

                    {/* Privacy Level */}
                    <td className="text-center p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPrivacyBadgeColor(facilitator.privacyLevel)}`}>
                        {facilitator.privacyLevel}
                      </span>
                    </td>

                    {/* API Endpoints */}
                    <td className="text-right p-6 font-mono text-text-primary">
                      {facilitator.apiEndpoints}
                    </td>

                    {/* Uptime */}
                    <td className="text-right p-6">
                      <span className={`font-mono ${getUptimeColor(facilitator.uptime)}`}>
                        {facilitator.uptime}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ZKx401 Position Badge */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-accent-purple/10 via-accent-cyan/10 to-accent-green/10 border border-accent-purple/20">
            <div className="p-3 rounded-xl bg-accent-purple/20">
              <Award className="w-6 h-6 text-accent-purple" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-text-primary">ZKx401 Competitive Advantages</h4>
              <p className="text-text-secondary">Lowest fees (30bps), highest privacy (ZK proofs), best uptime (99.8%)</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-purple">#1</div>
              <div className="text-xs text-text-tertiary">Privacy Score</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitatorComparison;