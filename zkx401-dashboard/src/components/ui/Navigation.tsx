import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '#hero' },
    { label: 'Network', href: '#network' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Advantages', href: '#advantages' },
    { label: 'Integration', href: '#integration' }
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-near-black/90 backdrop-blur-md border-b border-white/10' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Zap className="w-6 h-6 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                ZKx401
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-accent-cyan transition-colors duration-200 relative group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-cyan transition-all duration-200 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className="hidden md:inline-flex px-6 py-2 bg-accent-green text-black font-semibold rounded-lg hover:shadow-glow-green transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-accent-cyan transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-bg-near-black/95 backdrop-blur-md" />
            <div className="relative flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-2xl text-text-primary hover:text-accent-cyan transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.button
                className="mt-8 px-8 py-3 bg-accent-green text-black font-semibold rounded-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;