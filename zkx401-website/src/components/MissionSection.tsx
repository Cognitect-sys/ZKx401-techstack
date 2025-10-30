export default function MissionSection() {
  return (
    <section id="mission" className="py-16 lg:py-24 bg-background-near-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Visual Element (40%) */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-square bg-background-card rounded-2xl flex items-center justify-center border border-border-subtle shadow-card animate-slide-up">
                <div className="text-center">
                  <div className="w-24 h-24 bg-accent-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto animate-float">
                    <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">ZK</span>
                    </div>
                  </div>
                  <p className="text-text-tertiary text-sm">Zero-Knowledge Proof</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content (60%) */}
          <div className="mt-10 lg:mt-0 lg:col-span-7">
            <h2 className="text-headline-1 font-semibold text-text-primary mb-8 animate-slide-up">
              Private Agent Platform with ZKx401 Integration
            </h2>
            
            <div className="space-y-6">
              <p className="text-body text-text-secondary leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
                ZKx401 is a comprehensive platform for launching and deploying autonomous private agents 
                with built-in zero-knowledge payment integration. Each agent operates with complete privacy 
                while handling blockchain transactions seamlessly.
              </p>
              
              <p className="text-body text-text-secondary leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                Whether you're building trading bots, service agents, or DeFi automation tools, 
                ZKx401 provides the infrastructure needed for privacy-first autonomous operations 
                with integrated payment processing capabilities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Autonomous agent deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">ZKx401 payment integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Privacy-first operations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Blockchain-native transactions</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <button className="bg-accent-primary hover:bg-accent-hover text-white px-6 py-3 rounded-md font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary">
                  Launch Agent
                </button>
                <button className="border border-border-moderate hover:border-accent-primary text-text-secondary hover:text-accent-primary px-6 py-3 rounded-md font-semibold text-sm transition-all duration-150">
                  API Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}