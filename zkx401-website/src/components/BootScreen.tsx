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
    <div className={`fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 z-50 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Enhanced Smoky Atmospheric Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-900/40 to-slate-950/90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_50%_at_20%_30%,_rgba(59,130,246,0.1),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_25%_40%_at_85%_75%,_rgba(15,23,42,0.7),transparent)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(60deg,_transparent_30%,_rgba(30,58,138,0.15)_60%,_transparent_90%)]"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_30deg_at_70%_60%,_rgba(96,165,250,0.03),_rgba(15,23,42,0.6),_rgba(96,165,250,0.03),_transparent)]"></div>
      {/* Atmospheric Noise for Smoky Texture */}
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smokeFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smokeFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px'
      }}></div>
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">ZKx401 Agent Platform</h1>
            <p className="text-green-400 text-sm">Launching Private Agents with Privacy Integration</p>
          </div>

          {/* Terminal Window */}
          <div className="bg-slate-950/95 backdrop-blur-lg rounded-lg border border-slate-700/60 overflow-hidden shadow-2xl shadow-blue-950/30 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            {/* Enhanced Terminal Header with Smoky Effect */}
            <div className="bg-gradient-to-r from-slate-800/95 via-slate-900/90 to-slate-800/95 px-4 py-3 flex items-center space-x-3 border-b border-slate-700/60 backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-3.5 h-3.5 bg-red-500/90 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3.5 h-3.5 bg-yellow-500/90 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <div className="w-3.5 h-3.5 bg-green-500/90 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              </div>
              <span className="text-slate-300/90 text-sm ml-4 font-medium">zkx401-terminal</span>
              <span className="text-slate-500/80 text-xs ml-auto">Press ESC to skip</span>
            </div>

            {/* Enhanced Terminal Content with Glowing Text Effect */}
            <div className="p-5 font-mono text-sm bg-slate-950/80 backdrop-blur-sm relative">
              {/* Subtle glowing effect on text */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(59,130,246,0.02),transparent)]"></div>
              
              <div className="relative z-10">
                <div className="text-emerald-400/95 mb-3 font-semibold text-shadow-[0_0_8px_rgba(16,185,129,0.3)]">$ zkx401 launch-agent --type=private --privacy=zk-proof</div>
              
              {/* Boot messages */}
              <div className="space-y-1 min-h-[200px]">
                {bootLines.slice(0, Math.max(currentLine, 0)).map((line, index) => (
                  <div 
                    key={index}
                    className={`text-slate-300/95 animate-pulse text-shadow-[0_0_4px_rgba(148,163,184,0.2)] ${
                      index >= bootLines.length - 4 ? 'text-emerald-400/95 font-semibold text-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''
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
                  <div className="text-emerald-400 animate-pulse">
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
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="text-cyan-400 mb-2 font-semibold"># Code Generation:</div>
                  {codeSnippets.map((snippet, index) => (
                    <div 
                      key={index}
                      className={`text-slate-400 text-xs mb-2 transition-all duration-300 ${
                        currentLine > 6 + index * 2 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        animationDelay: `${(currentLine - 6 - index * 2) * 0.2}s`
                      }}
                    >
                      <pre className="text-slate-300">
                        {snippet.split('\n').map((line, lineIndex) => {
                          // Simple syntax highlighting
                          if (line.trim().startsWith('//')) {
                            return <div key={lineIndex} className="text-yellow-400/80 font-mono">{line}</div>;
                          }
                          
                          // Highlight keywords with simple string replacement
                          let processedLine = line;
                          const keywordRegex = /\b(const|new|await|import|from|class|function|if|else|for|while|return|public|private)\b/gi;
                          processedLine = processedLine.replace(keywordRegex, '<span class="text-emerald-400 font-semibold">$1</span>');
                          
                          // Highlight strings
                          const stringRegex = /(['"`])([^'"`]*?)\1/gi;
                          processedLine = processedLine.replace(stringRegex, '<span class="text-cyan-400">$1$2$1</span>');
                          
                          // Highlight numbers
                          const numberRegex = /\b(\d+)\b/g;
                          processedLine = processedLine.replace(numberRegex, '<span class="text-orange-400">$1</span>');
                          
                          return <div key={lineIndex} className="font-mono" dangerouslySetInnerHTML={{ __html: processedLine }} />;
                        })}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading bar */}
          <div className="mt-6">
            <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/30">
              <div 
                className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 h-full transition-all duration-300 ease-out shadow-lg shadow-emerald-400/20"
                style={{ width: `${Math.min((currentLine / bootLines.length) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-slate-400 text-xs mt-2">
              {currentLine >= bootLines.length ? '100% Complete' : `${Math.round((currentLine / bootLines.length) * 100)}% Complete`}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}