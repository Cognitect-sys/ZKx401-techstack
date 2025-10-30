import { Brain, Server, Coins, CreditCard } from 'lucide-react';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const useCases: UseCase[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Private AI Services",
    description: "Access AI APIs anonymously without exposing identity or usage patterns."
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Anonymous API Access",
    description: "Secure API consumption without revealing user information or subscription details."
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Privacy-Focused DeFi",
    description: "Build DeFi applications that prioritize confidentiality and financial privacy."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Confidential Payments",
    description: "Process payments with full anonymity and transaction privacy guarantees."
  }
];

export default function UseCasesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Built For
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            ZKx401 is designed for various use cases requiring high privacy 
            in the blockchain ecosystem and decentralized applications.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="text-center group transition-all duration-250 hover:transform hover:-translate-y-1 animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-accent-primary transition-all duration-250 group-hover:shadow-glow-subtle rounded-lg bg-accent-primary/5">
                {useCase.icon}
              </div>

              {/* Title */}
              <h3 className="text-body font-semibold text-text-primary mb-4">
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-small text-text-secondary leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-16 text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="bg-background-card border border-border-subtle rounded-lg p-8 shadow-card max-w-2xl mx-auto">
            <p className="text-body text-text-secondary mb-6">
              Ready to implement privacy-first solutions in your project?
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('quickstart');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-3 rounded-md font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}