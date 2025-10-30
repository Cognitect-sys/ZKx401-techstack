import { Github, Package, BookOpen } from 'lucide-react';

export default function CTAFooterSection() {
  return (
    <section id="install" className="py-16 lg:py-24 bg-background-near-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <h2 className="text-headline-1 font-semibold text-text-primary mb-6 animate-slide-up">
          Start Building Private Applications
        </h2>
        
        <p className="text-body text-text-secondary mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          Join ecosystem developers building privacy-first solutions with ZKx401. 
          Install the package and start developing anonymous applications today.
        </p>

        {/* Primary CTA */}
        <div className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('npm install @payai/x402-solana');
              // You could add a toast notification here
            }}
            className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-4 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary inline-flex items-center space-x-3"
          >
            <Package size={20} />
            <span>Install Package</span>
          </button>
        </div>

        {/* Secondary Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <a 
            href="#docs" 
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-background-card border border-border-subtle rounded-lg hover:shadow-card-hover hover:border-border-moderate transition-all duration-250 group"
          >
            <BookOpen className="w-5 h-5 text-accent-primary group-hover:animate-glow-pulse" />
            <span className="text-body text-text-secondary group-hover:text-text-primary transition-colors duration-150">
              Documentation
            </span>
          </a>

          <a 
            href="#github" 
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-background-card border border-border-subtle rounded-lg hover:shadow-card-hover hover:border-border-moderate transition-all duration-250 group"
          >
            <Github className="w-5 h-5 text-accent-primary group-hover:animate-glow-pulse" />
            <span className="text-body text-text-secondary group-hover:text-text-primary transition-colors duration-150">
              GitHub
            </span>
          </a>

          <a 
            href="#npm" 
            className="flex items-center justify-center space-x-3 px-6 py-4 bg-background-card border border-border-subtle rounded-lg hover:shadow-card-hover hover:border-border-moderate transition-all duration-250 group"
          >
            <Package className="w-5 h-5 text-accent-primary group-hover:animate-glow-pulse" />
            <span className="text-body text-text-secondary group-hover:text-text-primary transition-colors duration-150">
              NPM Package
            </span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border-subtle animate-slide-up" style={{animationDelay: '0.4s'}}>
          <p className="text-small text-text-tertiary">
            © 2025 ZKx401. Built with privacy-first principles for the Solana ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
}