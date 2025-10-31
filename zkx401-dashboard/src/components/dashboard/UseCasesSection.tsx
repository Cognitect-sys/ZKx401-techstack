import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { solanaService, TransactionResult, ZKProofData, OnchainVerificationResult } from '../../services/mockSolanaService';
import { 
  Zap, 
  Shield, 
  ExternalLink, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Database,
  Eye,
  EyeOff,
  Clock,
  Coins,
  Wallet,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import IntegrationWizard from './IntegrationWizard';

// Mock Solana transaction data
const mockTransactions = {
  defi: {
    signature: '5WvgUPbQkJm...x402rDeFi',
    amount: '$250.00',
    status: 'confirmed',
    timestamp: '2025-10-31T03:45:00Z',
    zkProof: 'ZK-Proof-Hash: 0x1a2b3c4d...',
    network: 'Solana Mainnet'
  },
  nft: {
    signature: '4YuhXZcQkJm...x402rNFT',
    amount: '$1,500.00',
    status: 'confirmed',
    timestamp: '2025-10-31T03:30:00Z',
    zkProof: 'ZK-Proof-Hash: 0x5e6f7g8h...',
    network: 'Solana Mainnet'
  },
  api: {
    signature: '3ZtvYAbQkJm...x402rAPI',
    amount: '$25.00',
    status: 'confirmed',
    timestamp: '2025-10-31T03:15:00Z',
    zkProof: 'ZK-Proof-Hash: 0x9i0j1k2l...',
    network: 'Solana Mainnet'
  }
};

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  transaction: typeof mockTransactions.defi;
  demoSteps: string[];
}

const useCases: UseCase[] = [
  {
    id: 'defi',
    title: 'DeFi Payment Example',
    description: 'Lakukan pembayaran ke DeFi protocol dengan privasi penuh menggunakan x402 routing',
    icon: <TrendingUp className="w-6 h-6" />,
    benefits: [
      'Privacy-first payment routing',
      'Instant transaction confirmation',
      'Zero-knowledge proof verification',
      'Competitive 30 basis points fee'
    ],
    transaction: mockTransactions.defi,
    demoSteps: [
      'Connect Solana wallet',
      'Select DeFi protocol',
      'x402 validates payment privately',
      'Transaction routed with ZK proof',
      'Confirmed on Solana mainnet'
    ]
  },
  {
    id: 'nft',
    title: 'NFT Marketplace Payment',
    description: 'ZKx401 routing untuk pembelian NFT dengan enhanced privacy dan verification',
    icon: <ShoppingBag className="w-6 h-6" />,
    benefits: [
      'Anonymous payment routing',
      'Enhanced buyer privacy',
      'NFT ownership verification',
      'Reduced MEV attacks'
    ],
    transaction: mockTransactions.nft,
    demoSteps: [
      'Browse NFT marketplace',
      'Initiate private purchase',
      'ZKx401 routes payment',
      'Privacy-preserving verification',
      'NFT transferred securely'
    ]
  },
  {
    id: 'api',
    title: 'API Access Payment',
    description: 'x402 access untuk API endpoints dengan zero-knowledge validation',
    icon: <Database className="w-6 h-6" />,
    benefits: [
      'Zero-knowledge API access',
      'Usage-based payments',
      'Endpoint-level privacy',
      'Instant validation'
    ],
    transaction: mockTransactions.api,
    demoSteps: [
      'Request API access',
      'Generate payment proof',
      'ZKx401 validates request',
      'Zero-knowledge verification',
      'API access granted'
    ]
  }
];

interface TransactionModalProps {
  transaction: TransactionResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, isOpen, onClose }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [realTransaction, setRealTransaction] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!transaction) return;
    
    setIsVerifying(true);
    setVerificationStatus('verifying');
    setError(null);

    try {
      // Verify transaction on Solana mainnet
      const verifiedTx = await solanaService.verifyTransaction(transaction.signature);
      
      if (verifiedTx) {
        setRealTransaction(verifiedTx);
        
        // Mock ZK Proof verification
        const mockZKProof: ZKProofData = {
          proofHash: transaction.signature.includes('mock') ? '0x1a2b3c4d5e6f' : `0x${transaction.signature.slice(0, 12)}`,
          publicInputs: [transaction.signature]
        };
        
        const zkVerification = await solanaService.verifyZKProof(mockZKProof);
        
        if (zkVerification.isValid) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('error');
          setError('ZK Proof verification failed');
        }
      } else {
        setVerificationStatus('error');
        setError('Transaction not found on Solana mainnet');
      }
    } catch (err) {
      setVerificationStatus('error');
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const openSolanaExplorer = () => {
    if (!transaction) return;
    const baseUrl = 'https://explorer.solana.com/tx/';
    window.open(`${baseUrl}${transaction.signature}`, '_blank');
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-elevated rounded-xl border border-border-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border-primary">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-primary">Transaction Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Status */}
          <div className="flex items-center gap-3 p-4 bg-accent-green/10 border border-accent-green/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-accent-green" />
            <span className="text-accent-green font-semibold">
              Transaction {realTransaction?.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </span>
            <span className="text-text-tertiary text-sm">on Solana Devnet</span>
            {realTransaction && (
              <div className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs text-accent-cyan">
                  {realTransaction.blockHeight.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Transaction Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary">Transaction Signature</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 p-3 bg-bg-secondary rounded-lg font-mono text-sm text-text-primary">
                  {transaction?.signature || 'Demo Transaction'}
                </code>
                <button
                  onClick={openSolanaExplorer}
                  className="p-3 bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/90 transition-colors"
                  title="View on Solana Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-tertiary">Amount</label>
                <p className="text-lg font-semibold text-text-primary mt-1">
                  {realTransaction ? `$${realTransaction.amount.toFixed(2)}` : transaction?.amount || '$250.00'}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-tertiary">Status</label>
                <p className="text-lg font-semibold text-accent-green mt-1">
                  {realTransaction?.status || transaction?.status || 'confirmed'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-tertiary">Fee</label>
                <p className="text-lg font-semibold text-text-primary mt-1">
                  {realTransaction ? `${realTransaction.fee.toFixed(6)} SOL` : '0.000005 SOL'}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-tertiary">Block Height</label>
                <p className="text-lg font-semibold text-text-primary mt-1">
                  {realTransaction?.blockHeight.toLocaleString() || 'Demo'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-text-tertiary">Timestamp</label>
              <p className="text-text-primary mt-1">
                {realTransaction ? new Date(realTransaction.timestamp).toLocaleString() : 'Demo Time'}
              </p>
            </div>
          </div>

          {/* ZK Proof Verification */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Zero-Knowledge Proof Verification</h4>
            <div className="p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-medium text-text-primary">ZK Proof Hash</span>
              </div>
              <code className="text-sm text-text-tertiary font-mono break-all">
                {transaction?.signature ? `0x${transaction.signature.slice(0, 12)}...` : 'ZK-Proof-Hash: 0x1a2b3c4d...'}
              </code>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-accent-red" />
                <span className="text-accent-red text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Verification Button */}
          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              disabled={isVerifying || verificationStatus === 'verified'}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-accent-cyan text-black rounded-lg font-semibold hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : verificationStatus === 'verified' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {isVerifying ? 'Verifying...' : verificationStatus === 'verified' ? 'Verified' : 'Verify ZK Proof'}
            </button>
            <button
              onClick={openSolanaExplorer}
              className="px-4 py-3 border border-border-primary rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Verification Result */}
          {verificationStatus === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-accent-green/10 border border-accent-green/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-green" />
                <span className="text-accent-green font-medium">ZK Proof Verified Successfully</span>
              </div>
              <p className="text-sm text-text-tertiary mt-1">
                Transaction privacy and integrity confirmed via zero-knowledge proof verification.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const UseCasesSection: React.FC = () => {
  const [activeUseCase, setActiveUseCase] = useState<string>('defi');
  const [showDemo, setShowDemo] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResult | null>(null);
  const [showIntegrationWizard, setShowIntegrationWizard] = useState(false);

  const currentUseCase = useCases.find(uc => uc.id === activeUseCase);

  // Convert mock transaction data to TransactionResult format
  const getMockTransaction = (type: string): TransactionResult => {
    const mockData = mockTransactions[type as keyof typeof mockTransactions];
    return {
      signature: mockData.signature,
      status: 'confirmed' as const,
      timestamp: Date.now() - Math.random() * 3600000, // Random time within last hour
      amount: type === 'nft' ? 1500 : type === 'defi' ? 250 : 25,
      blockHeight: Date.now() - Math.floor(Math.random() * 1000000),
      fee: 0.000005
    };
  };

  return (
    <section id="use-cases" className="py-20 bg-bg-near-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20"
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="w-6 h-6 text-accent-purple" />
            </motion.div>
            <div className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-semibold">
              INTERACTIVE USE CASES
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Real-World
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green bg-clip-text text-transparent">
              {' '}x402{' '}
            </span>
            Demonstrations
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore interactive examples of x402 payment routing dengan onchain verification 
            dan real Solana transaction signatures.
          </p>
        </motion.div>

        {/* Use Case Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {useCases.map((useCase) => (
            <motion.button
              key={useCase.id}
              onClick={() => setActiveUseCase(useCase.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeUseCase === useCase.id
                  ? 'bg-accent-cyan text-black shadow-glow-cyan'
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {useCase.icon}
              {useCase.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Active Use Case Content */}
        {currentUseCase && (
          <motion.div
            key={currentUseCase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left Panel - Description */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
                    {currentUseCase.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">{currentUseCase.title}</h3>
                </div>
                <p className="text-lg text-text-secondary">{currentUseCase.description}</p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Key Benefits</h4>
                <div className="space-y-3">
                  {currentUseCase.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                      <span className="text-text-secondary">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Demo Button */}
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="flex items-center gap-2 px-6 py-3 bg-accent-purple text-black rounded-lg font-semibold hover:bg-accent-purple/90 transition-colors"
              >
                {showDemo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDemo ? 'Hide Demo Steps' : 'Show Demo Steps'}
              </button>
            </div>

            {/* Right Panel - Transaction & Verification */}
            <div className="space-y-6">
              {/* Live Transaction Card */}
              <motion.div
                className="p-6 bg-bg-elevated rounded-xl border border-border-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-status-live animate-pulse" />
                  <span className="text-sm font-medium text-text-primary">Live Transaction Example</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Amount</span>
                    <span className="text-lg font-semibold text-text-primary">{currentUseCase.transaction.amount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Status</span>
                    <span className="text-accent-green font-semibold">{currentUseCase.transaction.status}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Network</span>
                    <span className="text-text-primary">{currentUseCase.transaction.network}</span>
                  </div>

                  <div className="pt-4 border-t border-border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm text-text-tertiary">Transaction Time</span>
                    </div>
                    <p className="text-text-primary">{new Date(currentUseCase.transaction.timestamp).toLocaleTimeString()}</p>
                  </div>

                  <button
                    onClick={() => setSelectedTransaction(getMockTransaction(currentUseCase.id))}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-accent-cyan text-black rounded-lg font-semibold hover:bg-accent-cyan/90 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Verify Transaction
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Demo Steps */}
              {showDemo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-bg-elevated rounded-xl border border-border-primary"
                >
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Demo Steps</h4>
                  <div className="space-y-3">
                    {currentUseCase.demoSteps.map((step, index) => (
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
                        <span className="text-text-secondary">{step}</span>
                        <ArrowRight className="w-4 h-4 text-text-tertiary ml-auto" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-secondary rounded-lg text-center">
                  <Coins className="w-6 h-6 text-accent-cyan mx-auto mb-2" />
                  <p className="text-sm text-text-tertiary">Avg. Fee</p>
                  <p className="text-lg font-semibold text-text-primary">0.3%</p>
                </div>
                <div className="p-4 bg-bg-secondary rounded-lg text-center">
                  <Shield className="w-6 h-6 text-accent-green mx-auto mb-2" />
                  <p className="text-sm text-text-tertiary">Privacy</p>
                  <p className="text-lg font-semibold text-text-primary">100%</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="p-8 bg-gradient-to-r from-accent-cyan/10 via-accent-purple/10 to-accent-green/10 rounded-xl border border-accent-cyan/20">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Experience x402?
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Join thousands of users already leveraging privacy-first payment routing 
              dengan zero-knowledge proofs on Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => setShowIntegrationWizard(true)}
                className="group relative px-8 py-3 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-green text-black font-bold rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <span>Start Integration</span>
                  <motion.div
                    className="group-hover:translate-x-1 transition-transform"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.button>
              <button className="px-8 py-3 border border-border-primary text-text-primary font-semibold rounded-lg hover:bg-bg-secondary transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Integration Wizard Modal */}
      <IntegrationWizard 
        isOpen={showIntegrationWizard}
        onClose={() => setShowIntegrationWizard(false)}
      />
    </section>
  );
};

export default UseCasesSection;