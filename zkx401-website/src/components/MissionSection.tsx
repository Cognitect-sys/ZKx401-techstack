export default function MissionSection() {
  return (
    <section id="mission" className="py-16 lg:py-24 bg-background-near-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Visual Element (40%) */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-square bg-background-pure-black rounded-2xl flex items-center justify-center border border-border-subtle">
                <div className="text-center">
                  <div className="w-24 h-24 bg-accent-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">ZK</span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">Zero-Knowledge Proof</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content (60%) */}
          <div className="mt-10 lg:mt-0 lg:col-span-7">
            <h2 className="text-headline-1 font-semibold text-text-primary mb-8">
              Privacy-First Protocol for Solana
            </h2>
            
            <div className="space-y-6">
              <p className="text-body text-text-secondary leading-relaxed">
                ZKx401 revolucionario pendekatan terhadap privasi dalam ekosistem blockchain Solana. 
                Dengan mengintegrasikan teknologi zero-knowledge proofs, protocol ini memungkinkan 
                transaksi yang sepenuhnya anonim tanpa mengorbankan transparency atau performance.
              </p>
              
              <p className="text-body text-text-secondary leading-relaxed">
                Dikembangkan untuk mengaddress kebutuhan komunitas crypto yang semakin menuntut 
                privacy-focused solutions, ZKx401 menyediakan infrastructure yang diperlukan 
                untuk membangun aplikasi DeFi yang confidential.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Anonymous transactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Zero-knowledge proofs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Solana integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                  <span className="text-small text-text-secondary">Privacy-first design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}