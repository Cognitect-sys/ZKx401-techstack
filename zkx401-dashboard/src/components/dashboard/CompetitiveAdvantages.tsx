import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Network, DollarSign, Code, Users } from 'lucide-react';

const CompetitiveAdvantages: React.FC = () => {
  const advantages = [
    {
      title: 'Zero-Knowledge Privacy',
      description: 'Advanced ZK proofs обеспечивают complete transaction privacy tanpa compromising functionality. Unlike transparent competitors, ZKx401 protects user data.',
      icon: <Shield className="w-8 h-8" />,
      gradient: 'from-accent-cyan to-blue-500'
    },
    {
      title: '30 Basis Points Routing',
      description: 'Competitive routing fee yang significantly lower dari competitors. PayAI (45bps), Daydreams (50bps), AurraCloud (40bps) vs ZKx401 (30bps).',
      icon: <DollarSign className="w-8 h-8" />,
      gradient: 'from-accent-green to-emerald-500'
    },
    {
      title: 'Trust Layer Integration',
      description: 'Built-in trust verification system dengan fraud prevention dan reputation scoring untuk enhanced security dan reliability.',
      icon: <Network className="w-8 h-8" />,
      gradient: 'from-accent-purple to-violet-500'
    },
    {
      title: 'Discovery Network',
      description: 'Advanced network discovery dan routing optimization untuk improved transaction throughput dan reduced latency.',
      icon: <Zap className="w-8 h-8" />,
      gradient: 'from-accent-cyan to-cyan-400'
    },
    {
      title: 'Revenue Sharing Model',
      description: 'Fair revenue distribution model dengan incentives untuk facilitators, sellers, dan ecosystem participants.',
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-accent-green to-green-400'
    },
    {
      title: 'Enterprise API',
      description: 'Comprehensive API suite untuk enterprise integrations dengan rate limiting, monitoring, dan advanced analytics.',
      icon: <Code className="w-8 h-8" />,
      gradient: 'from-accent-purple to-purple-400'
    }
  ];

  return (
    <section id="advantages" className="py-20 bg-bg-elevated">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Competitive Edge
          </div>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            ZKx401 Competitive Advantages
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Why ZKx401 leads dalam x402 facilitator ecosystem dengan privacy-first approach, 
            competitive pricing, dan cutting-edge technology.
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              className="group stat-card overflow-hidden relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 text-accent-cyan w-fit mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  {advantage.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-h3 font-semibold text-text-primary mb-4 group-hover:text-accent-cyan transition-colors duration-200">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {advantage.description}
                </p>

                {/* Visual Element - Geometric Pattern */}
                <div className="mt-6 relative">
                  <div className={`w-20 h-20 mx-auto rounded-lg bg-gradient-to-br ${advantage.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}>
                    <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/10 to-white/5">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 rounded-full bg-current opacity-60"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Banner */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent-cyan/10 to-transparent border border-accent-cyan/20">
            <div className="text-2xl font-bold text-accent-cyan mb-2">99.9%</div>
            <div className="text-text-secondary">Privacy Score</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent-green/10 to-transparent border border-accent-green/20">
            <div className="text-2xl font-bold text-accent-green mb-2">30bps</div>
            <div className="text-text-secondary">Lowest Fee Rate</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent-purple/10 to-transparent border border-accent-purple/20">
            <div className="text-2xl font-bold text-accent-purple mb-2">99.8%</div>
            <div className="text-text-secondary">Network Uptime</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompetitiveAdvantages;