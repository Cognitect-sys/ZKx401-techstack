import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Github, Twitter, MessageSquare, ExternalLink, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { label: 'Dashboard', href: '#hero' },
      { label: 'API Documentation', href: '#' },
      { label: 'Network Status', href: '#network' },
      { label: 'Comparison', href: '#comparison' }
    ],
    developers: [
      { label: 'API Reference', href: '#' },
      { label: 'SDK Download', href: '#' },
      { label: 'Integration Guide', href: '#' },
      { label: 'Code Examples', href: '#' }
    ],
    company: [
      { label: 'About ZKx401', href: '#' },
      { label: 'Team', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' }
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Whitepaper', href: '#' },
      { label: 'Support', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <MessageSquare className="w-5 h-5" />, href: '#', label: 'Discord' },
    { icon: <ExternalLink className="w-5 h-5" />, href: '#', label: 'Website' }
  ];

  return (
    <footer className="bg-bg-near-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Zap className="w-6 h-6 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold text-text-primary">ZKx401</span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">
              Privacy-first x402 facilitator untuk Solana ecosystem. 
              Zero-knowledge proofs, competitive pricing, real-time monitoring.
            </p>
            
            {/* Network Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <div className="live-indicator" />
              <div>
                <div className="text-sm font-semibold text-accent-green">Network Operational</div>
                <div className="text-xs text-text-tertiary">99.8% uptime • Last updated 2s ago</div>
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Developers
            </h4>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cyan transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Copyright */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-text-tertiary text-sm">
              © 2025 ZKx401. All rights reserved.
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-medium">
              <Shield className="w-3 h-3" />
              SOC 2 Compliant
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-text-tertiary text-sm mr-2">Follow us:</span>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="p-2 rounded-lg text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-lg bg-bg-elevated">
              <div className="text-lg font-bold text-accent-cyan mb-1">$640K+</div>
              <div className="text-sm text-text-secondary">24H Volume</div>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <div className="text-lg font-bold text-accent-green mb-1">594K+</div>
              <div className="text-sm text-text-secondary">24H Transactions</div>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <div className="text-lg font-bold text-accent-purple mb-1">37K+</div>
              <div className="text-sm text-text-secondary">Active Wallets</div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;