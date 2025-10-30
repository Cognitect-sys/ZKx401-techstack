import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Database, TrendingUp, Shield, Globe } from 'lucide-react';

const SimpleNetworkMonitor: React.FC = () => {
  const networkStats = [
    {
      title: 'Solana TPS',
      value: '3,267',
      change: 5.2,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: 'Average Gas Fee',
      value: '0.000000',
      prefix: '$',
      change: -8.1,
      changeType: 'negative' as const,
      showLiveIndicator: true,
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: 'Block Height',
      value: '376,892,142',
      change: 0,
      changeType: 'neutral' as const,
      showLiveIndicator: true,
      icon: <Database className="w-5 h-5" />
    },
    {
      title: 'x402 TPS',
      value: '6.9',
      change: 12.8,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'Active Facilitators',
      value: '8',
      change: 4.5,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: 'Market Cap',
      value: '$12M',
      prefix: '$',
      change: 18.7,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <Globe className="w-5 h-5" />
    }
  ];

  const StatCard = ({ stat }: { stat: typeof networkStats[0] }) => (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {stat.showLiveIndicator && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <span className="text-text-secondary text-sm">{stat.title}</span>
        </div>
        <div className="text-accent-cyan">
          {stat.icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 font-mono">
          {stat.prefix}{stat.value}
        </span>
        {stat.change !== 0 && (
          <span className={`text-xs font-medium ${
            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change > 0 ? '↗' : '↘'} {Math.abs(stat.change)}%
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="network" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Real-Time Network Status
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Live x402 Network Monitor
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive real-time monitoring of Solana network performance, 
            x402 protocol metrics, and ZK proof generation statistics.
          </p>
        </motion.div>

        {/* Network Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {networkStats.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </motion.div>

        {/* Simple Chart Placeholder */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Transaction Volume</h3>
            <p className="text-sm text-gray-600">Clean, minimal chart design</p>
          </div>
          
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-accent-cyan mx-auto mb-4" />
              <p className="text-text-secondary">Ultra-clean chart visualization</p>
              <p className="text-sm text-text-tertiary mt-2">Professional, minimal design</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleNetworkMonitor;
