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
    description: "Access AI APIs secara anonymous tanpa exposed identity atau usage patterns."
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Anonymous API Access",
    description: "Secure API consumption tanpa revealing user information atau subscription details."
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Privacy-Focused DeFi",
    description: "Build DeFi applications yang mengutamakan confidentiality dan financial privacy."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Confidential Payments",
    description: "Process payments dengan full anonymity dan transaction privacy guarantees."
  }
];

export default function UseCasesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Built For
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            ZKx401 dirancang untuk berbagai use case yang membutuhkan privacy tinggi 
            dalam ecosystem blockchain dan decentralized applications.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="text-center group transition-all duration-250 hover:transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-accent-primary transition-all duration-250 group-hover:shadow-glow-subtle">
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
        <div className="mt-16 text-center">
          <p className="text-body text-text-secondary mb-6">
            Siap untuk implementasi privacy-first dalam project Anda?
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('install');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-3 rounded-md font-semibold text-body transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary"
          >
            Explore Implementation
          </button>
        </div>
      </div>
    </section>
  );
}