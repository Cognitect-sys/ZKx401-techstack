import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Github, Twitter, MessageSquare, ExternalLink, Shield, 
  Mail, Heart, Globe, FileText, Users, Code, BookOpen
} from 'lucide-react';

const Footer: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState({
    uptime: 99.8,
    lastUpdate: '2s ago',
    status: 'operational'
  });

  // Simulate real-time network status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStatus(prev => ({
        ...prev,
        lastUpdate: '1s ago'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const footerLinks = {
    product: [
      { 
        label: 'Dashboard', 
        href: '#hero',
        icon: <Globe className="w-4 h-4" />,
        description: 'Real-time monitoring'
      },
      { 
        label: 'API Documentation', 
        href: '#',
        icon: <BookOpen className="w-4 h-4" />,
        description: 'Complete API reference'
      },
      { 
        label: 'Network Status', 
        href: '#network',
        icon: <Shield className="w-4 h-4" />,
        description: 'Live network metrics'
      },
      { 
        label: 'Comparison', 
        href: '#comparison',
        icon: <Users className="w-4 h-4" />,
        description: 'Competitive analysis'
      }
    ],
    developers: [
      { 
        label: 'API Reference', 
        href: '#',
        icon: <Code className="w-4 h-4" />,
        description: 'REST & GraphQL APIs'
      },
      { 
        label: 'SDK Download', 
        href: '#',
        icon: <ExternalLink className="w-4 h-4" />,
        description: 'JavaScript, Python, Go'
      },
      { 
        label: 'Integration Guide', 
        href: '#',
        icon: <FileText className="w-4 h-4" />,
        description: 'Step-by-step tutorials'
      },
      { 
        label: 'Code Examples', 
        href: '#',
        icon: <Github className="w-4 h-4" />,
        description: 'Ready-to-use snippets'
      }
    ],
    company: [
      { 
        label: 'About ZKx401', 
        href: '#',
        icon: <Users className="w-4 h-4" />,
        description: 'Our mission & vision'
      },
      { 
        label: 'Team', 
        href: '#',
        icon: <Heart className="w-4 h-4" />,
        description: 'Meet the creators'
      },
      { 
        label: 'Careers', 
        href: '#',
        icon: <Mail className="w-4 h-4" />,
        description: 'Join our mission'
      },
      { 
        label: 'Contact', 
        href: '#',
        icon: <MessageSquare className="w-4 h-4" />,
        description: 'Get in touch'
      }
    ],
    resources: [
      { 
        label: 'Documentation', 
        href: '#',
        icon: <BookOpen className="w-4 h-4" />,
        description: 'Comprehensive guides'
      },
      { 
        label: 'Blog', 
        href: '#',
        icon: <FileText className="w-4 h-4" />,
        description: 'Latest insights'
      },
      { 
        label: 'Whitepaper', 
        href: '#',
        icon: <Shield className="w-4 h-4" />,
        description: 'Technical deep-dive'
      },
      { 
        label: 'Support', 
        href: '#',
        icon: <MessageSquare className="w-4 h-4" />,
        description: '24/7 assistance'
      }
    ]
  };

  const socialLinks = [
    { 
      icon: <Github className="w-5 h-5" />, 
      href: '#', 
      label: 'GitHub',
      description: 'View our code'
    },
    { 
      icon: <Twitter className="w-5 h-5" />, 
      href: '#', 
      label: 'Twitter',
      description: 'Follow updates'
    },
    { 
      icon: <MessageSquare className="w-5 h-5" />, 
      href: '#', 
      label: 'Discord',
      description: 'Join community'
    },
    { 
      icon: <ExternalLink className="w-5 h-5" />, 
      href: '#', 
      label: 'Website',
      description: 'Main website'
    }
  ];

  const quickStats = [
    { value: '$640K+', label: '24H Volume', color: 'text-accent-cyan' },
    { value: '594K+', label: '24H Transactions', color: 'text-accent-green' },
    { value: '37K+', label: 'Active Wallets', color: 'text-accent-purple' }
  ];

  return (
    <footer className="bg-bg-near-black border-t border-white/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-cyan/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
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
              <motion.div 
                className="p-2.5 rounded-xl bg-accent-cyan/10"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-6 h-6 text-accent-cyan" />
              </motion.div>
              <span className="text-xl font-bold text-text-primary">ZKx401</span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">
              Privacy-first x402 facilitator untuk Solana ecosystem. 
              Zero-knowledge proofs, competitive pricing, real-time monitoring.
            </p>
            
            {/* Enhanced Network Status */}
            <motion.div 
              className="flex items-center gap-3 p-4 rounded-xl bg-accent-green/10 border border-accent-green/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="live-indicator" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-accent-green">Network Operational</span>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-accent-green animate-pulse"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="text-xs text-text-tertiary">
                  {networkStatus.uptime}% uptime • Last updated {networkStatus.lastUpdate}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Links Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-6 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-cyan transition-all duration-200 group p-2 rounded-lg hover:bg-bg-hover"
                    whileHover={{ x: 5 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{link.description}</div>
                    </div>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-6 uppercase tracking-wider">
              Developers
            </h4>
            <ul className="space-y-3">
              {footerLinks.developers.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-cyan transition-all duration-200 group p-2 rounded-lg hover:bg-bg-hover"
                    whileHover={{ x: 5 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{link.description}</div>
                    </div>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-6 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-cyan transition-all duration-200 group p-2 rounded-lg hover:bg-bg-hover"
                    whileHover={{ x: 5 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{link.description}</div>
                    </div>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-6 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-cyan transition-all duration-200 group p-2 rounded-lg hover:bg-bg-hover"
                    whileHover={{ x: 5 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{link.description}</div>
                    </div>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between pt-8 border-t border-white/5 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Copyright and Compliance */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 lg:mb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-text-tertiary text-sm">
                © 2025 ZKx401. All rights reserved.
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  Privacy First
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary text-sm mr-2 hidden sm:inline">Follow us:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={social.href}
                    className="group p-2.5 rounded-lg text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-200 relative"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                    title={social.description}
                  >
                    {social.icon}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-bg-modal text-xs text-text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {social.description}
                    </div>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Live Network Statistics</h3>
            <p className="text-sm text-text-tertiary">Real-time metrics from the ZKx401 network</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 rounded-xl bg-bg-elevated border border-white/5 hover:border-accent-cyan/20 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="text-center">
                  <motion.div 
                    className={`text-3xl font-bold mb-2 ${stat.color}`}
                    key={stat.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-text-secondary font-medium">
                    {stat.label}
                  </div>
                  <motion.div 
                    className="mt-2 w-full h-0.5 bg-bg-hover rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-md mx-auto p-6 rounded-xl bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/20">
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                Stay Updated
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Get the latest updates on ZKx401 development and network metrics.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-bg-hover border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent"
                />
                <motion.button
                  className="px-6 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan-dark transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;