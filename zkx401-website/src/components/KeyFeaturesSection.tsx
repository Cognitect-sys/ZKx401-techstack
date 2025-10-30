import { Shield, Eye, Lock } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Zero-Knowledge Proofs",
    description: "Cryptographic proofs yang memungkinkan validasi transaksi tanpa Reveal information sensitif, memastikan privacy máximo dengan security terjamin."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Anonymous Transactions",
    description: "Transaksi yang sepenuhnya anonim dengan hidden sender, receiver, dan amount. Tidak ada kemungkinan tracking atau analysis on-chain."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Privacy-First Design",
    description: "Architektur yang dibangun dengan privacy sebagai foundation, bukan afterthought. Setiap komponen designed untuk maintain confidentiality."
  }
];

export default function KeyFeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Privacy-First Features
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            ZKx401 menyediakan set komprehensif fitur privacy yang dirancang khusus untuk 
            necessidades komunitas blockchain Solana yang membutuhkan confidentiality tinggi.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background-elevated border border-border-subtle rounded-lg p-8 transition-all duration-250 hover:bg-background-hover hover:border-border-moderate hover:-translate-y-1 hover:shadow-card"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-accent-primary/10 rounded-lg mb-6 transition-all duration-250 group-hover:shadow-glow-subtle">
                <div className="text-accent-primary">
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-headline-2 font-semibold text-text-primary mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-body text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}