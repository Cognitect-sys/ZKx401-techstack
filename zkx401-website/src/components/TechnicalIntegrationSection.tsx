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
    <section id="quickstart" className="py-16 lg:py-24 bg-background-near-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Quick Start
          </h2>
          <p className="text-body text-text-secondary leading-relaxed">
            Mulai gunakan ZKx401 dalam project Solana Anda dengan package @payai/x402-solana
          </p>
        </div>

        {/* Installation Code Block */}
        <div className="mb-8">
          <div className="bg-background-elevated border border-border-subtle rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
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
              <pre className="text-code text-text-primary font-mono leading-relaxed overflow-x-auto">
                <code>{installCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Usage Code Block */}
        <div>
          <div className="bg-background-elevated border border-border-subtle rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
              <span className="text-small text-text-tertiary font-medium">Usage Example</span>
              <button
                onClick={() => copyToClipboard(usageCode)}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-small">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6">
              <pre className="text-code text-text-primary font-mono leading-relaxed overflow-x-auto">
                <code>{usageCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-small text-text-tertiary">
            Untuk dokumentasi lengkap dan contoh implementasi,{' '}
            <button 
              onClick={() => window.open('#', '_blank')}
              className="text-accent-primary hover:text-accent-hover transition-colors duration-150"
            >
              lihat documentation kami
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}