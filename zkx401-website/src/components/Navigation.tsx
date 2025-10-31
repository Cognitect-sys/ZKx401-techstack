import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/85 backdrop-blur-lg border-b border-slate-700/60 shadow-lg shadow-black/30 shadow-[0_8px_32px_rgba(15,23,42,0.6)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-text-primary">ZKx401</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <button 
                onClick={() => scrollToSection('docs')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                Docs
              </button>
              <button 
                onClick={() => scrollToSection('github')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                GitHub
              </button>
              <button 
                onClick={() => scrollToSection('npm')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                NPM
              </button>
            </div>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <button 
              onClick={() => scrollToSection('install')}
              className="bg-accent-primary hover:bg-accent-hover text-white px-4 py-2 rounded-md font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
              <button 
                onClick={() => scrollToSection('docs')}
                className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                Docs
              </button>
              <button 
                onClick={() => scrollToSection('github')}
                className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                GitHub
              </button>
              <button 
                onClick={() => scrollToSection('npm')}
                className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium text-sm"
              >
                NPM
              </button>
              <button 
                onClick={() => scrollToSection('install')}
                className="block w-full text-left px-3 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-colors duration-150 mt-4"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}