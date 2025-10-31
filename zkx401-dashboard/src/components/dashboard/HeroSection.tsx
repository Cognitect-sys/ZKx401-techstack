import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../ui/StatCard';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Zap, TrendingUp, Users, DollarSign, AlertCircle, Sparkles, Code, ArrowRight } from 'lucide-react';
import IntegrationWizard from './IntegrationWizard';

const HeroSection: React.FC = () => {
  const { data, isLoading, error, lastUpdate } = useDashboardData();
  const [showIntegrationWizard, setShowIntegrationWizard] = useState(false);

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
            fixed 0.1 USDC fee per transaction, dan real-time transaction monitoring.
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
          {/* Enhanced Start Integration Button */}
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green text-black font-bold rounded-xl text-lg overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowIntegrationWizard(true)}
          >
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Sparkle Effects */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="absolute top-2 left-4 w-4 h-4 text-yellow-400" />
              <Sparkles className="absolute top-4 right-6 w-3 h-3 text-white" />
              <Sparkles className="absolute bottom-3 left-6 w-3 h-3 text-cyan-300" />
            </motion.div>

            {/* Button Content */}
            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              <span>Start Integration</span>
              <motion.div
                className="group-hover:translate-x-1 transition-transform"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Pulse Animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-accent-cyan opacity-50"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>

          {/* Enhanced Dashboard Button */}
          <motion.button
            className="group relative px-8 py-4 border-2 border-accent-cyan text-accent-cyan font-semibold rounded-xl text-lg overflow-hidden backdrop-blur-sm"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              borderColor: "rgba(34, 211, 238, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {/* Hover Background Animation */}
            <motion.div
              className="absolute inset-0 bg-accent-cyan/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-accent-cyan"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>View Dashboard</span>
            </div>
          </motion.button>

          {/* Enhanced Documentation Button */}
          <motion.button
            className="group relative px-8 py-4 border-2 border-accent-purple text-accent-purple font-semibold rounded-xl text-lg overflow-hidden backdrop-blur-sm"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              borderColor: "rgba(168, 85, 247, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Code className="w-5 h-5" />
              </motion.div>
              <span>Developer Docs</span>
            </div>

            {/* Documentation Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-accent-purple/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
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

      {/* Integration Wizard Modal */}
      <IntegrationWizard 
        isOpen={showIntegrationWizard}
        onClose={() => setShowIntegrationWizard(false)}
      />
    </section>
  );
};

export default HeroSection;