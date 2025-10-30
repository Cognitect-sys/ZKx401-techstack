import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '../ui/StatCard';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Zap, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { data, isLoading, error, lastUpdate } = useDashboardData();

  const heroStats = [
    {
      title: '24H Transactions',
      value: data.x402Metrics.totalTransactions,
      change: 12.5, // Calculate from historical data
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <TrendingUp className="w-5 h-5" />,
      format: 'number' as const
    },
    {
      title: 'Payment Volume',
      value: data.x402Metrics.totalVolume / 1000, // Convert to thousands
      prefix: '$',
      change: 8.2,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <DollarSign className="w-5 h-5" />,
      format: 'currency' as const
    },
    {
      title: 'Active Wallets',
      value: 37000, // This would come from actual x402 wallet tracking
      change: 15.3,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <Users className="w-5 h-5" />,
      format: 'number' as const
    },
    {
      title: 'Seller Endpoints',
      value: 17000, // This would come from actual endpoint registry
      change: 9.8,
      changeType: 'positive' as const,
      showLiveIndicator: true,
      icon: <Zap className="w-5 h-5" />,
      format: 'number' as const
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-pure-black via-bg-near-black to-bg-elevated" />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4" />
          <p className="text-text-secondary">Loading real-time data...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-pure-black via-bg-near-black to-bg-elevated" />
        <div className="relative z-10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-accent-red mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">Connection Error</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent-cyan text-black rounded-lg font-semibold hover:bg-accent-cyan/90"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-pure-black via-bg-near-black to-bg-elevated" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-8 h-8 text-accent-cyan" />
            </motion.div>
            <div className="px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-xs font-semibold">
              LIVE x402 FACILITATOR
            </div>
          </div>

          <motion.h1
            className="text-hero md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ZKx401
            <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text text-transparent">
              x402 Facilitator
            </span>
          </motion.h1>

          <motion.p
            className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Privacy-first payment routing untuk Solana ecosystem dengan zero-knowledge proofs, 
            competitive 30 basis points routing fee, dan real-time transaction monitoring.
          </motion.p>

          {/* Data Update Status */}
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-text-tertiary mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-status-live animate-pulse-green" />
            <span>Live data • Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </motion.div>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            className="px-8 py-4 bg-accent-cyan text-black font-semibold rounded-lg text-lg hover:shadow-glow-cyan transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Dashboard
          </motion.button>
          <motion.button
            className="px-8 py-4 border-2 border-accent-purple text-accent-purple font-semibold rounded-lg text-lg hover:bg-accent-purple hover:text-black transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Documentation
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-accent-cyan/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent-cyan rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;