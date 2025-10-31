import { Shield, Eye, Lock, Layers, Database, Bot } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const features: Feature[] = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Composable Context Architecture",
    description: "Modular context system inspired by Daydreams. Each context handles specific functionality and can be composed using .use() pattern for complex behaviors.",
    badge: "Daydreams"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Persistent Memory System",
    description: "Dual-tier memory architecture with Working Memory (session) and Context Memory (persistent). Automatically persists across sessions with TTL support.",
    badge: "New"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Type-Safe Action System",
    description: "Execute actions through a type-safe executor with Zod schema validation. Built-in schemas for privacy, payment, blockchain, and agent operations.",
    badge: "Enhanced"
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Agent Deployment Context",
    description: "Deploy autonomous agents with privacy preservation and payment integration. Support for multiple capabilities and resource management.",
    badge: "Beta"
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Zero-Knowledge Privacy Context",
    description: "Generate ZK proofs and store private data securely. Built-in encryption and privacy-preserving computation capabilities.",
    badge: "Core"
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Payment Context (x402 Protocol)",
    description: "Handle USDC micropayments via x402 protocol on Solana. Support for fee estimation, transaction processing, and balance management.",
    badge: "Production"
  }
];

export default function KeyFeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-transparent">
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
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 transition-all duration-250 hover:shadow-xl hover:shadow-blue-950/20 hover:border-slate-600/50 hover:-translate-y-1 group animate-slide-up relative"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    feature.badge === 'Daydreams' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : feature.badge === 'New'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : feature.badge === 'Enhanced'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : feature.badge === 'Beta'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : feature.badge === 'Core'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {feature.badge}
                  </span>
                </div>
              )}

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

        {/* Architecture Overview */}
        <div className="mt-16 bg-gradient-to-br from-background-card to-background-secondary rounded-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Daydreams-Powered Architecture
            </h3>
            <p className="text-text-secondary max-w-3xl mx-auto">
              ZKx401 now implements the same composable context architecture that powers leading AI frameworks, 
              adapted for blockchain and privacy-preserving applications.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Context Creation</h4>
              <p className="text-sm text-text-secondary">Create isolated contexts with their own memory and state</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Composition</h4>
              <p className="text-sm text-text-secondary">Compose contexts using .use() pattern for complex behaviors</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Action Execution</h4>
              <p className="text-sm text-text-secondary">Execute type-safe actions with schema validation</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Memory Persistence</h4>
              <p className="text-sm text-text-secondary">Automatic memory persistence across sessions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}