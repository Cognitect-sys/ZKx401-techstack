import { Shield, Eye, Lock } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Agent Privacy Layer",
    description: "Deploy private agents with built-in zero-knowledge privacy. Each agent operates with complete confidentiality while handling blockchain transactions."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "ZKx401 Payment Integration",
    description: "Seamless integration with ZKx401 protocol for anonymous payments. Agents can process transactions without revealing sensitive financial data."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Autonomous Security",
    description: "Quantum-resistant security for autonomous operations. Your private agents remain protected against future cryptographic threats."
  }
];

export default function KeyFeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Private Agent Platform Features
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            Deploy autonomous private agents with built-in ZKx401 payment integration. 
            Each agent operates with complete privacy and handles blockchain transactions securely.
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