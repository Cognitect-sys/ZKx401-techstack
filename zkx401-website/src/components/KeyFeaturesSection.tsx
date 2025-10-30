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
    description: "Advanced cryptographic proofs that enable transaction validation without revealing sensitive information, ensuring maximum privacy with guaranteed security."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Anonymous Transactions",
    description: "Fully anonymous transactions with hidden sender, receiver, and amounts. No possibility of on-chain tracking or analysis."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Privacy-First Design",
    description: "Architecture built with privacy as the foundation, not an afterthought. Every component designed to maintain complete confidentiality."
  }
];

export default function KeyFeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Privacy-First Features
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            ZKx401 provides a comprehensive suite of privacy features specifically designed for 
            the Solana blockchain community's need for high-level confidentiality and security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background-card border border-border-subtle rounded-lg p-8 transition-all duration-250 hover:shadow-card-hover hover:-translate-y-1 group animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
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