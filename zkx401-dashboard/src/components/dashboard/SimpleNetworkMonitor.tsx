import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Database, TrendingUp, Shield, Globe } from 'lucide-react';

const SimpleNetworkMonitor: React.FC = () => {
  // Generate mock transaction volume data
  const generateMockData = () => {
    const hours = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      const volume = Math.floor(Math.random() * 1500) + 200; // Random volume between 200-1700
      
      hours.push({
        time: hour.toString().padStart(2, '0') + ':00',
        volume,
        type: hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
      });
    }
    
    return hours;
  };

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
          
          <div className="h-80 bg-gray-50 rounded-lg p-4">
            <div className="h-full flex flex-col">
              {/* Chart Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-900">x402 Transaction Volume</div>
                <div className="text-xs text-gray-500">Last 24 hours</div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex-1 flex items-end justify-between space-x-1 px-4">
                {generateMockData().map((item, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    {/* Bar */}
                    <div 
                      className="w-6 bg-gradient-to-t from-accent-cyan to-accent-purple rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                      style={{ 
                        height: `${(item.volume / 1000) * 100}%`,
                        minHeight: '4px'
                      }}
                      title={`Volume: ${item.volume} | Time: ${item.time}`}
                    />
                    {/* Time Label */}
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="flex justify-between mt-2 px-4">
                <span className="text-xs text-gray-400">0</span>
                <span className="text-xs text-gray-400">500</span>
                <span className="text-xs text-gray-400">1000</span>
                <span className="text-xs text-gray-400">1500</span>
                <span className="text-xs text-gray-400">2000+</span>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center mt-3">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-accent-cyan rounded-sm"></div>
                    <span className="text-gray-600">DeFi Volume</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-accent-purple rounded-sm"></div>
                    <span className="text-gray-600">NFT Volume</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleNetworkMonitor;
