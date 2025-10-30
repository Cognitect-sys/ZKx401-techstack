/**
 * Daydreams Architecture Demo Component
 * Interactive demonstration of ZKx401's composable context system
 */

import { useState, useEffect } from 'react';

interface DemoStep {
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
  timestamp?: Date;
}

export default function DaydreamsDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([
    {
      title: "Composable Context Architecture",
      description: "Context composition dengan .use() pattern",
      status: 'pending'
    },
    {
      title: "Zero-Knowledge Privacy Context",
      description: "Generate ZK proofs dan store private data",
      status: 'pending'
    },
    {
      title: "Payment Context (x402 Protocol)",
      description: "Process USDC micropayments on Solana",
      status: 'pending'
    },
    {
      title: "Blockchain Context Integration",
      description: "Deploy contracts dan execute transactions",
      status: 'pending'
    },
    {
      title: "Agent Deployment Context",
      description: "Deploy autonomous agents dengan privacy",
      status: 'pending'
    },
    {
      title: "Persistent Memory System",
      description: "Working Memory + Context Memory dual-tier",
      status: 'pending'
    },
    {
      title: "Universal AI Gateway",
      description: "Multi-provider AI integration ready",
      status: 'pending'
    },
    {
      title: "MCP Integration Ready",
      description: "Model Context Protocol support",
      status: 'pending'
    }
  ]);

  const runDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Reset all steps
    setDemoSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      
      // Update current step to running
      setDemoSteps(steps => steps.map((step, index) => 
        index === i ? { ...step, status: 'running', timestamp: new Date() } : step
      ));

      // Simulate processing time
      const processingTime = 800 + Math.random() * 1200;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Mark as completed
      setDemoSteps(steps => steps.map((step, index) => 
        index === i ? { ...step, status: 'completed', timestamp: new Date() } : step
      ));
    }

    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>;
      case 'running':
        return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'completed':
        return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>;
      case 'error':
        return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'running': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section className="py-16 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Daydreams Architecture Demo
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Experience our composable context system in action. Each step demonstrates a core component 
            of the Daydreams-inspired architecture powering ZKx401.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Demo Controls */}
          <div className="bg-background-card rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Interactive Architecture Tour
            </h3>
            <p className="text-text-secondary mb-6">
              Click the button below to see how ZKx401's context system works in real-time.
            </p>
            
            <button
              onClick={runDemo}
              disabled={isPlaying}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 mb-6 ${
                isPlaying 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-accent-primary hover:bg-accent-hover hover:shadow-glow-primary transform hover:-translate-y-0.5'
              }`}
            >
              {isPlaying ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Running Demo...
                </span>
              ) : (
                'Start Architecture Demo'
              )}
            </button>

            {/* Current Step Display */}
            {currentStep >= 0 && (
              <div className="bg-background-secondary rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-text-primary">
                    Current Step: {currentStep + 1} of {demoSteps.length}
                  </h4>
                  <span className={`text-sm font-medium ${getStatusColor(demoSteps[currentStep]?.status)}`}>
                    {demoSteps[currentStep]?.status.toUpperCase()}
                  </span>
                </div>
                <h5 className="text-text-primary font-medium mb-1">
                  {demoSteps[currentStep]?.title}
                </h5>
                <p className="text-text-secondary text-sm">
                  {demoSteps[currentStep]?.description}
                </p>
                {demoSteps[currentStep]?.timestamp && (
                  <p className="text-xs text-text-muted mt-2">
                    Started at: {demoSteps[currentStep].timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Demo Steps */}
          <div className="space-y-3">
            {demoSteps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  step.status === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : step.status === 'running'
                    ? 'bg-blue-50 border-blue-200 shadow-lg'
                    : step.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-background-card border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <h4 className={`font-medium ${getStatusColor(step.status)}`}>
                      {step.title}
                    </h4>
                    <p className="text-text-secondary text-sm mt-1">
                      {step.description}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-text-muted mt-2">
                        {step.status === 'completed' ? 'Completed' : 'Started'} at: {step.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-background-card rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Composable Contexts</h3>
            <p className="text-text-secondary text-sm">
              Modular context system where each context handles specific functionality and can be composed using .use() pattern.
            </p>
          </div>

          <div className="bg-background-card rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Privacy First</h3>
            <p className="text-text-secondary text-sm">
              Zero-knowledge proofs and encrypted data handling built into every context for maximum privacy protection.
            </p>
          </div>

          <div className="bg-background-card rounded-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">High Performance</h3>
            <p className="text-text-secondary text-sm">
              Optimized memory management and action execution system for enterprise-grade performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}