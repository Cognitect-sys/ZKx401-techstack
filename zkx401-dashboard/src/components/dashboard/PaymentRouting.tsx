import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, CheckCircle, User, CreditCard } from 'lucide-react';

const PaymentRouting: React.FC = () => {
  const flowSteps = [
    {
      step: 1,
      title: 'Buyer Initiates',
      description: 'User initiates x402 payment through ZKx401 interface',
      icon: <User className="w-6 h-6" />,
      color: 'accent-cyan'
    },
    {
      step: 2,
      title: 'ZKx401 Validates',
      description: 'ZKx401 trust layer validates transaction details dan compliance',
      icon: <Shield className="w-6 h-6" />,
      color: 'accent-green'
    },
    {
      step: 3,
      title: 'ZK Proof Generated',
      description: 'Zero-knowledge proof created untuk transaction privacy',
      icon: <Zap className="w-6 h-6" />,
      color: 'accent-purple'
    },
    {
      step: 4,
      title: 'Payment Routed',
      description: 'Transaction routed ke seller dengan 0.1 USDC routing fee',
      icon: <ArrowRight className="w-6 h-6" />,
      color: 'accent-cyan'
    },
    {
      step: 5,
      title: 'Confirmation',
      description: 'Both parties receive confirmation dan transaction recorded',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'accent-green'
    }
  ];

  const routingStats = [
    { label: 'Avg Processing Time', value: '2.3s', color: 'accent-cyan' },
    { label: 'Success Rate', value: '99.8%', color: 'accent-green' },
    { label: 'Routing Fee', value: '30bps', color: 'accent-purple' }
  ];

  return (
    <section className="py-20 bg-bg-near-black">
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
            <CreditCard className="w-4 h-4" />
            Payment Flow
          </div>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            How ZKx401 Routes Payments
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Streamlined x402 payment routing dengan zero-knowledge privacy, 
            competitive fees, dan instant settlement.
          </p>
        </motion.div>

        {/* Flow Visualization */}
        <div className="relative mb-16">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Animated Flow Lines */}
            {[...Array(4)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${20 + i * 20}%`}
                y1="50%"
                x2={`${20 + (i + 1) * 20}%`}
                y2="50%"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="10,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
              />
            ))}
          </svg>

          {/* Flow Steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8" style={{ zIndex: 2 }}>
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`relative mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-${step.color}/20 to-${step.color}/10 border-2 border-${step.color}/30 flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`text-${step.color}`}>
                    {step.icon}
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg-near-black border-2 border-accent-cyan flex items-center justify-center">
                    <span className="text-xs font-bold text-accent-cyan">{step.step}</span>
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-status-live animate-pulse-green" />
                </motion.div>

                {/* Step Content */}
                <h3 className="text-h3 font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {routingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`text-3xl font-bold text-${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-text-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Split Diagram */}
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-h3 font-semibold text-text-primary mb-2">Revenue Split Model</h3>
            <p className="text-text-secondary">Transparent fee distribution untuk ecosystem sustainability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buyer */}
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 mb-4">
                <User className="w-8 h-8 text-accent-cyan mx-auto mb-2" />
                <div className="text-lg font-semibold text-accent-cyan">Buyer</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-text-primary">$1,000</div>
                <div className="text-text-secondary">Base Amount</div>
                <div className="text-sm text-accent-cyan">+ $0.1 fee (0.1 USDC)</div>
                <div className="text-lg font-semibold text-accent-cyan">Pays $1,000.10</div>
              </div>
            </motion.div>

            {/* ZKx401 (0.1 USDC) */}
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mb-4">
                <Zap className="w-8 h-8 text-accent-purple mx-auto mb-2" />
                <div className="text-lg font-semibold text-accent-purple">ZKx401</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-text-primary">$0.1</div>
                <div className="text-text-secondary">Routing Fee</div>
                <div className="text-sm text-accent-purple">0.1 USDC fixed</div>
                <div className="text-lg font-semibold text-accent-purple">Revenue</div>
              </div>
            </motion.div>

            {/* Seller */}
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 rounded-xl bg-accent-green/10 border border-accent-green/20 mb-4">
                <CheckCircle className="w-8 h-8 text-accent-green mx-auto mb-2" />
                <div className="text-lg font-semibold text-accent-green">Seller</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-text-primary">$1,000</div>
                <div className="text-text-secondary">Full Amount</div>
                <div className="text-sm text-accent-green">No deduction</div>
                <div className="text-lg font-semibold text-accent-green">Receives $1,000</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentRouting;