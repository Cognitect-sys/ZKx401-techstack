import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  CheckCircle, 
  Code, 
  Play, 
  ExternalLink, 
  Zap, 
  Shield, 
  Wallet, 
  Settings,
  BookOpen,
  Sparkles,
  Loader2,
  AlertCircle,
  Globe
} from 'lucide-react';

// Integration steps data
const integrationSteps = [
  {
    id: 'welcome',
    title: 'Welcome to x402',
    subtitle: 'Privacy-First Payment Integration',
    description: 'Learn how to integrate x402 payment routing with zero-knowledge proofs into your application.',
    icon: <Zap className="w-6 h-6" />,
    content: {
      title: 'What is x402?',
      description: 'x402 is a privacy-first payment routing facilitator for Solana that provides:',
      features: [
        'Zero-knowledge proof validation',
        'Privacy-preserving transaction routing',
        'Competitive 30 basis points fee',
        'Real-time onchain verification',
        'Seamless Solana integration'
      ],
      codeExample: `// x402 Integration Overview
import { x402Client } from '@zkx401/solana-client';

const client = new x402Client({
  network: 'mainnet-beta',
  privacy: true,
  zkVerification: true
});

// Initialize with your merchant config
await client.initialize({
  merchantId: 'your-merchant-id',
  apiEndpoint: 'your-api-endpoint'
});`
    }
  },
  {
    id: 'setup',
    title: 'Setup Environment',
    subtitle: 'Install & Configure SDK',
    description: 'Get your development environment ready with x402 SDK installation and configuration.',
    icon: <Settings className="w-6 h-6" />,
    content: {
      title: 'Installation & Setup',
      description: 'Install the x402 SDK and configure your development environment:',
      steps: [
        'Install x402 SDK via npm/yarn',
        'Configure your Solana connection',
        'Set up environment variables',
        'Initialize x402 client'
      ],
      codeExample: `# Install x402 SDK
npm install @zkx401/solana-client
# or
yarn add @zkx401/solana-client

# Environment variables
VITE_X402_API_KEY=your_api_key_here
VITE_SOLANA_NETWORK=mainnet-beta
VITE_MERCHANT_ID=your_merchant_id`
    }
  },
  {
    id: 'transaction',
    title: 'First Transaction',
    subtitle: 'Interactive Demo',
    description: 'Create your first private transaction using x402 payment routing.',
    icon: <Wallet className="w-6 h-6" />,
    content: {
      title: 'Process Your First Payment',
      description: 'Follow this step-by-step guide to process a private payment:',
      steps: [
        'Connect Solana wallet',
        'Generate ZK proof for payment',
        'Route through x402 facilitator',
        'Confirm on Solana mainnet',
        'Verify privacy preservation'
      ],
      codeExample: `// Process a private payment
import { x402Client, ZKProofGenerator } from '@zkx401/solana-client';

async function processPayment(amount, recipient) {
  // 1. Generate zero-knowledge proof
  const zkProof = await ZKProofGenerator.createProof({
    amount,
    recipient,
    timestamp: Date.now(),
    privacyHash: await generatePrivacyHash()
  });

  // 2. Initialize x402 client
  const client = new x402Client();
  await client.connect();

  // 3. Route payment through x402
  const result = await client.routePayment({
    amount,
    recipient,
    zkProof,
    fee: 0.003 // 0.3% fee
  });

  // 4. Verify onchain
  const verification = await client.verifyTransaction(result.signature);
  return { result, verification };
}`
    }
  },
  {
    id: 'verify',
    title: 'Verify & Test',
    subtitle: 'Onchain Verification',
    description: 'Verify your integration with real onchain data and privacy testing.',
    icon: <Shield className="w-6 h-6" />,
    content: {
      title: 'Verification & Testing',
      description: 'Test your integration with onchain verification and privacy validation:',
      steps: [
        'Verify transaction on Solana explorer',
        'Validate ZK proof integrity',
        'Test privacy preservation',
        'Check fee calculation',
        'Validate routing efficiency'
      ],
      codeExample: `// Verify transaction and privacy
import { x402Verifier, PrivacyValidator } from '@zkx401/solana-client';

// Verify onchain transaction
const isValid = await x402Verifier.verifyTransaction(signature);

// Validate ZK proof
const zkValid = await x402Verifier.verifyZKProof(proof);

// Test privacy preservation
const privacyTest = await PrivacyValidator.test({
  transactionSignature: signature,
  checkInputs: true,
  checkOutputs: true,
  checkTiming: true
});

console.log('Verification Results:', {
  onchain: isValid,
  zkProof: zkValid,
  privacy: privacyTest.isPrivate
});`
    }
  },
  {
    id: 'docs',
    title: 'Documentation',
    subtitle: 'Developer Resources',
    description: 'Access comprehensive documentation and join the developer community.',
    icon: <BookOpen className="w-6 h-6" />,
    content: {
      title: 'Developer Resources',
      description: 'Complete documentation and community resources:',
      resources: [
        { name: 'API Reference', url: '#', description: 'Complete API documentation' },
        { name: 'Integration Guide', url: '#', description: 'Step-by-step integration guide' },
        { name: 'ZK Proof Guide', url: '#', description: 'Zero-knowledge proof implementation' },
        { name: 'Community Forum', url: '#', description: 'Join our developer community' },
        { name: 'GitHub Repository', url: '#', description: 'Source code and examples' },
        { name: 'Discord Channel', url: '#', description: 'Real-time developer support' }
      ]
    }
  }
];

interface IntegrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntegrationWizard: React.FC<IntegrationWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const step = integrationSteps[currentStep];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const nextStep = () => {
    if (currentStep < integrationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulateTransaction = async () => {
    setIsSimulating(true);
    setSimulationComplete(false);

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSimulating(false);
    setSimulationComplete(true);

    // Auto-advance after simulation
    setTimeout(() => {
      if (currentStep < integrationSteps.length - 1) {
        nextStep();
      }
    }, 2000);
  };

  const progressPercentage = ((currentStep + 1) / integrationSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-bg-elevated rounded-xl border border-border-primary max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">x402 Integration Wizard</h2>
                <p className="text-sm text-text-secondary">Step {currentStep + 1} of {integrationSteps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-tertiary" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-bg-secondary rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-accent-cyan to-accent-purple h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
                    {step.icon}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-semibold">
                    STEP {currentStep + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-lg text-text-secondary mb-2">{step.subtitle}</p>
                <p className="text-text-tertiary">{step.description}</p>
              </div>

              {/* Step Content */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Panel - Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-3">{step.content.title}</h4>
                    <p className="text-text-secondary mb-4">{step.content.description}</p>
                  </div>

                  {/* Features or Steps */}
                  {'features' in step.content && (
                    <div className="space-y-3">
                      {step.content.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                          <span className="text-text-secondary">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {'steps' in step.content && (
                    <div className="space-y-3">
                      {step.content.steps.map((stepText, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center text-xs font-semibold text-accent-cyan">
                            {index + 1}
                          </div>
                          <span className="text-text-secondary">{stepText}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {'resources' in step.content && (
                    <div className="grid gap-3">
                      {step.content.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.url}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-text-primary">{resource.name}</div>
                            <div className="text-sm text-text-tertiary">{resource.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-text-tertiary" />
                        </motion.a>
                      ))}
                    </div>
                  )}

                  {/* Interactive Demo Button */}
                  {step.id === 'transaction' && (
                    <div className="pt-4">
                      <button
                        onClick={simulateTransaction}
                        disabled={isSimulating}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all disabled:opacity-50"
                      >
                        {isSimulating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : simulationComplete ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                        {isSimulating ? 'Processing Transaction...' : simulationComplete ? 'Transaction Complete!' : 'Simulate Transaction'}
                      </button>
                      
                      {simulationComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-accent-green/10 border border-accent-green/20 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-accent-green" />
                            <span className="text-accent-green font-medium">Transaction Simulation Successful</span>
                          </div>
                          <p className="text-sm text-text-tertiary">
                            Your private transaction has been processed through x402 routing with ZK proof verification.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Panel - Code Example */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-accent-cyan" />
                      <span className="text-sm font-medium text-text-primary">Code Example</span>
                    </div>
                    {step.content.codeExample && (
                      <button
                        onClick={() => copyToClipboard(step.content.codeExample!, `step-${currentStep}`)}
                        className="flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded text-xs hover:bg-bg-secondary/80 transition-colors"
                      >
                        {copiedCode === `step-${currentStep}` ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-accent-green" />
                            <span className="text-accent-green">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {step.content.codeExample && (
                    <div className="relative">
                      <SyntaxHighlighter
                        language="javascript"
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          borderRadius: '8px',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}
                      >
                        {step.content.codeExample}
                      </SyntaxHighlighter>
                    </div>
                  )}

                  {/* Additional Resources for Docs Step */}
                  {step.id === 'docs' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-accent-cyan/10 via-accent-purple/10 to-accent-green/10 rounded-lg border border-accent-cyan/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-accent-cyan" />
                          <span className="font-medium text-text-primary">Ready to Start Building?</span>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">
                          Join thousands of developers building privacy-first applications with x402.
                        </p>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-accent-cyan text-black text-sm font-semibold rounded hover:bg-accent-cyan/90 transition-colors">
                            Get Started
                          </button>
                          <button className="px-4 py-2 border border-border-primary text-text-secondary text-sm rounded hover:bg-bg-secondary transition-colors">
                            View Examples
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {integrationSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-accent-cyan' 
                      : index < currentStep 
                        ? 'bg-accent-green' 
                        : 'bg-bg-secondary'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === integrationSteps.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntegrationWizard;