import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function TechnicalIntegrationSection() {
  const [copied, setCopied] = useState(false);

  const installCode = `npm install @payai/x402-solana`;
  
  const usageCode = `import { ZKx401Client } from '@payai/x402-solana';

const client = new ZKx401Client({
  network: 'mainnet-beta',
  privateKey: process.env.SOLANA_PRIVATE_KEY
});

// Create anonymous transaction
const transaction = await client.createAnonymousTransaction({
  recipient: 'AnonymousAddress',
  amount: 1000000, // 1 SOL
  memo: 'Private payment'
});

// Submit with zero-knowledge proof
const signature = await client.submitWithProof(transaction);
console.log('Anonymous transaction:', signature);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-16 lg:py-24 bg-background-near-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Quick Start
          </h2>
          <p className="text-body text-text-secondary leading-relaxed">
            Get started with ZKx401 in your Solana project using the @payai/x402-solana package
          </p>
        </div>

        {/* Installation Code Block */}
        <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="bg-background-card border border-border-subtle rounded-lg overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-background-light-gray">
              <span className="text-small text-text-tertiary font-medium">Installation</span>
              <button
                onClick={() => copyToClipboard(installCode)}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-small">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6">
              <pre className="text-code text-text-primary font-mono leading-relaxed overflow-x-auto bg-transparent">
                <code>{installCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Usage Code Block */}
        <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-background-card border border-border-subtle rounded-lg overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-background-light-gray">
              <span className="text-small text-text-tertiary font-medium">Basic Usage</span>
              <button
                onClick={() => copyToClipboard(usageCode)}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-small">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6">
              <pre className="text-code text-text-primary font-mono leading-relaxed overflow-x-auto bg-transparent">
                <code>{usageCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="bg-background-card border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="text-headline-2 font-semibold text-text-primary mb-4">
              Ready to Build?
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Join the privacy revolution and start building confidential applications on Solana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-primary hover:bg-accent-hover text-white px-6 py-3 rounded-md font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary">
                View Documentation
              </button>
              <button className="border border-border-moderate hover:border-accent-primary text-text-secondary hover:text-accent-primary px-6 py-3 rounded-md font-semibold text-sm transition-all duration-150">
                GitHub Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}