import { Brain, Server, Coins, CreditCard } from 'lucide-react';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const useCases: UseCase[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Autonomous Trading Agents",
    description: "Deploy AI trading agents that execute DeFi strategies with complete privacy and anonymous ZKx401 payments."
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Private Service Agents",
    description: "Launch service agents that provide anonymous API access with built-in ZKx401 payment processing."
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "DeFi Automation",
    description: "Automate complex DeFi operations with privacy-first agents that handle transactions securely."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Payment Processors",
    description: "Create autonomous payment processing agents with integrated ZKx401 privacy protocols."
  }
];

export default function UseCasesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background-pure-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-headline-1 font-semibold text-text-primary mb-6">
            Agent Deployment Scenarios
          </h2>
          <p className="text-body text-text-secondary leading-relaxed max-w-3xl mx-auto">
            Deploy private autonomous agents for various blockchain operations. 
            Each agent comes with integrated ZKx401 payment processing and privacy protection.
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
              Ready to deploy your first private agent with ZKx401 integration?
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-accent-primary hover:bg-accent-hover text-white px-8 py-3 rounded-md font-semibold text-sm transition-all duration-150 transform hover:-translate-y-0.5 hover:shadow-glow-primary"
            >
              Deploy Agent Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}