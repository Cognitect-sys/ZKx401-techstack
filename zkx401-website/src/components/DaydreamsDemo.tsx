/**
 * ZKx401 Architecture Terminal Demo
 * Professional terminal interface showing Daydreams architecture generation
 */

import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'code' | 'info' | 'error';
  content: string;
  timestamp: Date;
  delay?: number;
}

export default function DaydreamsDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Comprehensive terminal output simulating 20 minutes of code generation
  const terminalOutput: TerminalLine[] = [
    { id: '1', type: 'info', content: 'ZKx401 Architecture Generator v2.1.0', timestamp: new Date(), delay: 500 },
    { id: '2', type: 'info', content: 'Initializing Daydreams Architecture Framework...', timestamp: new Date(), delay: 800 },
    { id: '3', type: 'info', content: 'Loading composable context system...', timestamp: new Date(), delay: 1200 },
    { id: '4', type: 'command', content: '$ npm init @zkx401/daydreams-framework', timestamp: new Date(), delay: 2000 },
    { id: '5', type: 'output', content: 'Creating new ZKx401 Daydreams project...', timestamp: new Date(), delay: 3500 },
    { id: '6', type: 'output', content: '✓ Project structure initialized', timestamp: new Date(), delay: 4000 },
    { id: '7', type: 'output', content: '✓ Dependencies installed', timestamp: new Date(), delay: 4500 },
    { id: '8', type: 'output', content: '✓ TypeScript configuration setup', timestamp: new Date(), delay: 5000 },
    
    // Core Architecture Setup
    { id: '9', type: 'command', content: '$ mkdir -p src/core src/contexts src/lib', timestamp: new Date(), delay: 6000 },
    { id: '10', type: 'command', content: '$ touch src/core/{actions.ts,memory.ts,types.ts}', timestamp: new Date(), delay: 7500 },
    { id: '11', type: 'output', content: 'Creating core architecture files...', timestamp: new Date(), delay: 9000 },
    
    // Memory System Implementation
    { id: '12', type: 'command', content: '$ nano src/core/memory.ts', timestamp: new Date(), delay: 11000 },
    { id: '13', type: 'code', content: 'interface WorkingMemory {\n  sessionId: string;\n  data: Map<string, any>;\n  timestamp: Date;\n  ttl?: number;\n}', timestamp: new Date(), delay: 13000 },
    { id: '14', type: 'code', content: 'interface ContextMemory {\n  contextId: string;\n  persistent: Map<string, any>;\n  encryption: CryptoKey;\n  access: Set<string>;\n}', timestamp: new Date(), delay: 15000 },
    { id: '15', type: 'output', content: '✓ Working memory system implemented', timestamp: new Date(), delay: 17000 },
    { id: '16', type: 'output', content: '✓ Context memory with encryption ready', timestamp: new Date(), delay: 18000 },
    
    // Privacy Context
    { id: '17', type: 'command', content: '$ touch src/contexts/PrivacyContext.ts', timestamp: new Date(), delay: 20000 },
    { id: '18', type: 'code', content: 'export class PrivacyContext implements BaseContext {\n  private zkpGenerator: ZKPGenerator;\n  private encryptionEngine: EncryptionEngine;\n  \n  async generateZKProof(data: any): Promise<ZKProof> {\n    return this.zkpGenerator.prove(data);\n  }\n}', timestamp: new Date(), delay: 22000 },
    { id: '19', type: 'output', content: '✓ Zero-knowledge proof generation enabled', timestamp: new Date(), delay: 25000 },
    { id: '20', type: 'output', content: '✓ Privacy-preserving operations ready', timestamp: new Date(), delay: 26000 },
    
    // Payment Context
    { id: '21', type: 'command', content: '$ touch src/contexts/PaymentContext.ts', timestamp: new Date(), delay: 28000 },
    { id: '22', type: 'code', content: 'export class PaymentContext implements BaseContext {\n  private solanaConnection: Connection;\n  private x402Client: X402Client;\n  \n  async processPayment(amount: number, recipient: string) {\n    const transaction = await this.x402Client.createPayment({\n      amount,\n      recipient,\n      currency: \'USDC\'\n    });\n    return await this.solanaConnection.sendTransaction(transaction);\n  }\n}', timestamp: new Date(), delay: 31000 },
    { id: '23', type: 'output', content: '✓ x402 protocol integration complete', timestamp: new Date(), delay: 34000 },
    { id: '24', type: 'output', content: '✓ USDC micropayment system ready', timestamp: new Date(), delay: 35000 },
    
    // Blockchain Context
    { id: '25', type: 'command', content: '$ touch src/contexts/BlockchainContext.ts', timestamp: new Date(), delay: 37000 },
    { id: '26', type: 'code', content: 'export class BlockchainContext implements BaseContext {\n  private program: Program;\n  private connection: Connection;\n  \n  async deployContract(programId: string, code: Buffer) {\n    const transaction = await this.program.methods\n      .deploy(code)\n      .accounts({ programId })\n      .rpc();\n    return transaction;\n  }\n}', timestamp: new Date(), delay: 40000 },
    { id: '27', type: 'output', content: '✓ Solana blockchain integration ready', timestamp: new Date(), delay: 43000 },
    { id: '28', type: 'output', content: '✓ Smart contract deployment enabled', timestamp: new Date(), delay: 44000 },
    
    // Agent Deployment Context
    { id: '29', type: 'command', content: '$ touch src/contexts/AgentDeploymentContext.ts', timestamp: new Date(), delay: 46000 },
    { id: '30', type: 'code', content: 'export class AgentDeploymentContext implements BaseContext {\n  private agentOrchestrator: AgentOrchestrator;\n  \n  async deployAgent(config: AgentConfig): Promise<AgentInstance> {\n    const instance = await this.agentOrchestrator.spawn({\n      ...config,\n      privacy: \'zkp\',\n      payment: \'x402\',\n      blockchain: \'solana\'\n    });\n    return instance;\n  }\n}', timestamp: new Date(), delay: 49000 },
    { id: '31', type: 'output', content: '✓ Autonomous agent deployment ready', timestamp: new Date(), delay: 52000 },
    { id: '32', type: 'output', content: '✓ Multi-context agent composition enabled', timestamp: new Date(), delay: 53000 },
    
    // Context Composition System
    { id: '33', type: 'command', content: '$ nano src/core/context.ts', timestamp: new Date(), delay: 55000 },
    { id: '34', type: 'code', content: 'export function composeContexts<T extends BaseContext>(\n  contexts: T[]\n): ComposedContext<T> {\n  return contexts.reduce((composed, context) => {\n    return Object.assign(composed, context, {\n      use: (nextContext: BaseContext) => {\n        return composeContexts([...contexts, nextContext]);\n      }\n    });\n  }, {} as ComposedContext<T>);\n}', timestamp: new Date(), delay: 58000 },
    { id: '35', type: 'output', content: '✓ Context composition system implemented', timestamp: new Date(), delay: 61000 },
    
    // Action System
    { id: '36', type: 'command', content: '$ touch src/core/actions.ts', timestamp: new Date(), delay: 63000 },
    { id: '37', type: 'code', content: 'export interface ActionExecutor {\n  execute<T>(action: Action<T>): Promise<T>;\n  validate(payload: any): boolean;\n  rollback(action: Action<any>): Promise<void>;\n}\n\nexport class TypeSafeActionExecutor implements ActionExecutor {\n  async execute<T>(action: Action<T>): Promise<T> {\n    this.validate(action.payload);\n    const result = await action.handler(action.payload);\n    await this.logExecution(action, result);\n    return result;\n  }\n}', timestamp: new Date(), delay: 66000 },
    { id: '38', type: 'output', content: '✓ Type-safe action execution system ready', timestamp: new Date(), delay: 69000 },
    
    // Integration and Testing
    { id: '39', type: 'command', content: '$ npm run build', timestamp: new Date(), delay: 71000 },
    { id: '40', type: 'output', content: 'Compiling TypeScript...', timestamp: new Date(), delay: 73000 },
    { id: '41', type: 'output', content: 'Running type checks...', timestamp: new Date(), delay: 75000 },
    { id: '42', type: 'output', content: 'Optimizing bundle...', timestamp: new Date(), delay: 77000 },
    { id: '43', type: 'output', content: '✓ Build completed successfully', timestamp: new Date(), delay: 79000 },
    
    // Final Integration
    { id: '44', type: 'command', content: '$ node scripts/integrate-contexts.js', timestamp: new Date(), delay: 81000 },
    { id: '45', type: 'output', content: 'Integrating Privacy + Payment + Blockchain contexts...', timestamp: new Date(), delay: 83000 },
    { id: '46', type: 'output', content: 'Setting up agent orchestration...', timestamp: new Date(), delay: 85000 },
    { id: '47', type: 'output', content: 'Initializing memory system...', timestamp: new Date(), delay: 87000 },
    { id: '48', type: 'output', content: '✓ ZKx401 Architecture fully integrated', timestamp: new Date(), delay: 89000 },
    
    // Deployment and Final Checks
    { id: '49', type: 'command', content: '$ npm run deploy:test', timestamp: new Date(), delay: 91000 },
    { id: '50', type: 'output', content: 'Deploying to testnet...', timestamp: new Date(), delay: 93000 },
    { id: '51', type: 'output', content: 'Running integration tests...', timestamp: new Date(), delay: 95000 },
    { id: '52', type: 'output', content: '✓ All tests passed', timestamp: new Date(), delay: 97000 },
    { id: '53', type: 'output', content: '✓ Zero-knowledge privacy verified', timestamp: new Date(), delay: 99000 },
    { id: '54', type: 'output', content: '✓ x402 payments functional', timestamp: new Date(), delay: 101000 },
    { id: '55', type: 'output', content: '✓ Blockchain transactions working', timestamp: new Date(), delay: 103000 },
    { id: '56', type: 'output', content: '✓ Agent deployment successful', timestamp: new Date(), delay: 105000 },
    
    // Final Success Message
    { id: '57', type: 'info', content: '🎉 ZKx401 Daydreams Architecture Generation Complete!', timestamp: new Date(), delay: 107000 },
    { id: '58', type: 'info', content: 'Architecture: ✅ Fully Deployed', timestamp: new Date(), delay: 109000 },
    { id: '59', type: 'info', content: 'Privacy: ✅ Zero-Knowledge Enabled', timestamp: new Date(), delay: 111000 },
    { id: '60', type: 'info', content: 'Payments: ✅ USDC x402 Protocol Ready', timestamp: new Date(), delay: 113000 },
    { id: '61', type: 'info', content: 'Blockchain: ✅ Solana Integration Active', timestamp: new Date(), delay: 115000 },
    { id: '62', type: 'info', content: 'Agents: ✅ Autonomous Deployment Ready', timestamp: new Date(), delay: 117000 },
    { id: '63', type: 'info', content: 'Total Build Time: 20 minutes 3 seconds', timestamp: new Date(), delay: 119000 },
    { id: '64', type: 'command', content: '$ echo "ZKx401 is ready for production"', timestamp: new Date(), delay: 121000 },
    { id: '65', type: 'output', content: 'ZKx401 is ready for production', timestamp: new Date(), delay: 123000 },
  ];

  useEffect(() => {
    if (isPlaying && currentLineIndex < terminalOutput.length) {
      const timer = setTimeout(() => {
        const nextLine = terminalOutput[currentLineIndex];
        setTerminalLines(prev => [...prev, nextLine]);
        setCurrentLineIndex(prev => prev + 1);
        
        // Update progress
        setProgress((currentLineIndex + 1) / terminalOutput.length * 100);
        
        // Scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        
        setIsTyping(true);
        
        // End typing animation after a brief delay
        setTimeout(() => setIsTyping(false), 300);
        
      }, terminalOutput[currentLineIndex]?.delay || 1000);
      
      return () => clearTimeout(timer);
    } else if (currentLineIndex >= terminalOutput.length) {
      setIsPlaying(false);
      setProgress(100);
    }
  }, [isPlaying, currentLineIndex, terminalOutput]);

  const startTerminalDemo = () => {
    setIsPlaying(true);
    setCurrentLineIndex(0);
    setTerminalLines([]);
    setProgress(0);
  };

  const getLineStyle = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-green-400 font-mono';
      case 'output':
        return 'text-blue-300 font-mono';
      case 'code':
        return 'text-yellow-300 font-mono whitespace-pre';
      case 'info':
        return 'text-purple-300 font-mono';
      case 'error':
        return 'text-red-400 font-mono';
      default:
        return 'text-gray-300 font-mono';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <section className="py-16 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ZKx401 Architecture Terminal
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-6">
            Watch our AI architecture generate the complete ZKx401 framework in real-time. 
            See how composable contexts, privacy protocols, and blockchain integration come together.
          </p>
          
          {/* Progress Bar */}
          {isPlaying && (
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between text-sm text-text-secondary mb-2">
                <span>Building Architecture...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <button
            onClick={startTerminalDemo}
            disabled={isPlaying}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 mb-8 ${
              isPlaying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isPlaying ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating Architecture...
              </span>
            ) : (
              'Start Architecture Demo'
            )}
          </button>
        </div>

        {/* Terminal Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-t-lg border border-gray-700 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm font-mono ml-4">ZKx401 Terminal</span>
              </div>
              <div className="text-gray-400 text-xs font-mono">
                {isPlaying ? 'BUILDING...' : 'READY'}
              </div>
            </div>
            
            {/* Terminal Content */}
            <div 
              ref={terminalRef}
              className="h-96 overflow-y-auto p-4 font-mono text-sm bg-gray-900 terminal-scroll"
            >
              {terminalLines.length === 0 ? (
                <div className="text-gray-500 italic">
                  Click "Start Architecture Demo" to begin building ZKx401...
                </div>
              ) : (
                terminalLines.map((line, index) => (
                  <div key={line.id} className="mb-1 animate-fade-in">
                    <span className="text-gray-500 text-xs mr-3">
                      [{formatTimestamp(line.timestamp)}]
                    </span>
                    {line.type === 'command' && (
                      <span className="text-green-400 mr-2">$</span>
                    )}
                    <span className={getLineStyle(line.type)}>
                      {line.content}
                    </span>
                    {isTyping && index === terminalLines.length - 1 && (
                      <span className="animate-pulse">█</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Terminal Footer */}
          <div className="bg-gray-800 rounded-b-lg border border-gray-700 border-t-0 px-4 py-2">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>Daydreams Architecture Framework v2.1.0</span>
              <span>
                {terminalLines.length} lines generated
                {isPlaying && ' • Building...'}
              </span>
            </div>
          </div>
        </div>

        {/* Architecture Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-background-card rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">65+</div>
            <div className="text-text-secondary">Lines of Code Generated</div>
          </div>
          <div className="bg-background-card rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">8</div>
            <div className="text-text-secondary">Core Components Built</div>
          </div>
          <div className="bg-background-card rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">4</div>
            <div className="text-text-secondary">Context Modules</div>
          </div>
          <div className="bg-background-card rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">20min</div>
            <div className="text-text-secondary">Build Simulation</div>
          </div>
        </div>
      </div>
    </section>
  );
}