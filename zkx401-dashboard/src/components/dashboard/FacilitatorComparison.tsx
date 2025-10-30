import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Clock, Zap, Award } from 'lucide-react';

const FacilitatorComparison: React.FC = () => {
  const facilitators = [
    {
      name: 'PayAI',
      marketCap: '$48M',
      activeWallets: '89K',
      transactionFee: '45bps',
      trustScore: 4.2,
      privacyLevel: 'Medium',
      apiEndpoints: '12',
      uptime: '99.2%',
      zkx401: false
    },
    {
      name: 'Daydreams',
      marketCap: '$16M',
      activeWallets: '34K',
      transactionFee: '50bps',
      trustScore: 3.8,
      privacyLevel: 'Low',
      apiEndpoints: '8',
      uptime: '97.8%',
      zkx401: false
    },
    {
      name: 'AurraCloud',
      marketCap: '$23M',
      activeWallets: '56K',
      transactionFee: '40bps',
      trustScore: 4.0,
      privacyLevel: 'Medium',
      apiEndpoints: '15',
      uptime: '98.9%',
      zkx401: false
    },
    {
      name: 'ZKx401',
      marketCap: '$12M',
      activeWallets: '37K',
      transactionFee: '30bps',
      trustScore: 4.9,
      privacyLevel: 'High',
      apiEndpoints: '18',
      uptime: '99.8%',
      zkx401: true
    }
  ];

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

        {/* Comparison Table */}
        <motion.div
          className="stat-card overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Table Header */}
          <div className="bg-bg-hover border-b border-white/10 p-6">
            <h3 className="text-h3 font-semibold text-text-primary">Facilitator Comparison Matrix</h3>
            <p className="text-text-secondary mt-2">Comprehensive metrics untuk competitive analysis</p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-text-secondary font-semibold">Facilitator</th>
                  <th className="text-right p-6 text-text-secondary font-semibold">Market Cap</th>
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
                      {facilitator.marketCap}
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
        </motion.div>

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