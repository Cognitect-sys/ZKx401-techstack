import { useState, useEffect } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const bootLines = [
    'Initializing ZKx401 Agent Platform...',
    'Loading private agent modules...',
    'Connecting to Solana blockchain...',
    'Setting up ZKx401 payment integration...',
    'Deploying quantum-resistant security...',
    'Configuring autonomous operations...',
    'Loading developer APIs...',
    'Setting up privacy protocols...',
    'Initializing agent deployment system...',
    'Loading zero-knowledge proof engines...',
    'Compiling privacy-preserving algorithms...',
    'Connecting to decentralized network...',
    'Validating cryptographic protocols...',
    'Boot sequence complete. Welcome to ZKx401.',
    '',
    '🚀 Agent Platform Ready',
    '💡 Deploy your private agents now',
    '🔐 Zero-knowledge privacy active',
    '⚡ Lightning-fast blockchain integration'
  ];

  const codeSnippets = [
    `// ZKx401 Agent Deployment
const agent = new ZKx401Agent({
  privacy: 'zero-knowledge',
  blockchain: 'solana',
  payment: 'anonymous'
});

agent.deploy({
  type: 'trading',
  strategy: 'defi-optimization',
  privacy: 'quantum-resistant'
});`,
    `// API Integration
import { ZKx401API } from '@zkx401/sdk';

const api = new ZKx401API({
  endpoint: 'agent-launch',
  privacy: true,
  encryption: 'zero-knowledge'
});

const response = await api.createAgent({
  name: 'PrivateTradingBot',
  capabilities: ['trading', 'payments']
});`,
    `// Payment Processing
const payment = await zkx401.process({
  type: 'anonymous',
  amount: 1000000000, // 1 SOL
  privacy: 'zk-proof',
  agent: 'autonomous'
});

console.log('Payment processed anonymously:', payment.hash);`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLine(prev => {
        const next = prev + 1;
        if (next >= bootLines.length) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Small fade-out delay
          }, 2000); // Show completion message for 2s
        }
        return next;
      });
    }, 500); // 500ms between lines

    return () => clearInterval(timer);
  }, [onComplete]);

  // ESC key handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(onComplete, 300);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-50 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">ZKx401 Agent Platform</h1>
            <p className="text-green-400 text-sm">Launching Private Agents with Privacy Integration</p>
          </div>

          {/* Terminal Window */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm ml-4">zkx401-terminal</span>
              <span className="text-gray-500 text-xs ml-auto">Press ESC to skip</span>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm">
              <div className="text-green-400 mb-2">$ zkx401 launch-agent --type=private --privacy=zk-proof</div>
              
              {/* Boot messages */}
              <div className="space-y-1 min-h-[200px]">
                {bootLines.slice(0, Math.max(currentLine, 0)).map((line, index) => (
                  <div 
                    key={index}
                    className={`text-gray-300 animate-pulse ${
                      index >= bootLines.length - 4 ? 'text-green-400 font-semibold' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    {line}
                  </div>
                ))}
                
                {/* Show current line being typed */}
                {currentLine < bootLines.length && (
                  <div className="text-green-400 animate-pulse">
                    {bootLines[currentLine] && (
                      <>
                        {bootLines[currentLine]}
                        <span className="animate-ping">█</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Code snippets when available */}
              {currentLine > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-blue-400 mb-2"># Code Generation:</div>
                  {codeSnippets.map((snippet, index) => (
                    <div 
                      key={index}
                      className={`text-gray-400 text-xs mb-2 transition-all duration-300 ${
                        currentLine > 6 + index * 2 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        animationDelay: `${(currentLine - 6 - index * 2) * 0.2}s`
                      }}
                    >
                      <pre>{snippet}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading bar */}
          <div className="mt-6">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min((currentLine / bootLines.length) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-gray-400 text-xs mt-2">
              {currentLine >= bootLines.length ? '100% Complete' : `${Math.round((currentLine / bootLines.length) * 100)}% Complete`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}