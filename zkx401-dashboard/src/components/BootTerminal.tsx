import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeLine {
  line: string;
  delay: number;
  type: 'command' | 'output' | 'comment' | 'code';
}

const generateBootCode = (): CodeLine[] => {
  const codeLines: CodeLine[] = [];
  
  // ZKx401 Blockchain initialization code
  const bootSequence: CodeLine[] = [
    { line: "[INFO] Initializing ZKx401 Protocol...", delay: 500, type: 'output' },
    { line: "[STEP] Loading Zero-Knowledge circuits...", delay: 800, type: 'output' },
    { line: "zkx401@mainnet:~$ git clone https://github.com/zkx401/protocol.git", delay: 1200, type: 'command' },
    { line: "Cloning into 'protocol'... done.", delay: 1800, type: 'output' },
    { line: "// ZKx401 Solidity Contract", delay: 2500, type: 'comment' },
    { line: "pragma solidity ^0.8.19;", delay: 2800, type: 'code' },
    { line: "contract ZKx401 {", delay: 3200, type: 'code' },
    { line: "    using ZK for ZKBlock;", delay: 3600, type: 'code' },
    { line: "    mapping(address => bytes32) public commitments;", delay: 4000, type: 'code' },
    { line: "    function commit(bytes32 commitment) external {", delay: 4400, type: 'code' },
    { line: "        commitments[msg.sender] = commitment;", delay: 4800, type: 'code' },
    { line: "    }", delay: 5200, type: 'code' },
    { line: "}", delay: 5600, type: 'code' },
    { line: "[VALIDATION] Proving circuit compiled successfully", delay: 6000, type: 'output' },
    { line: "zkx401@mainnet:~$ ./zkx401-cli initialize --network mainnet", delay: 6800, type: 'command' },
    { line: "[INFO] Connecting to Solana RPC endpoints...", delay: 7500, type: 'output' },
    { line: "[SUCCESS] Connected to 12 RPC endpoints", delay: 8200, type: 'output' },
    { line: "// Rust ZK Proof Generation", delay: 9000, type: 'comment' },
    { line: "use ark_groth16::{ProvingKey, VerifyingKey};", delay: 9300, type: 'code' },
    { line: "use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};", delay: 9700, type: 'code' },
    { line: "fn generate_proof(params: &ProvingKey, witness: &[FieldElement]) -> Result<Proof> {", delay: 10100, type: 'code' },
    { line: "    let mut rng = &mut OsRng;", delay: 10500, type: 'code' },
    { line: "    let proof = groth16::prove(params, witness, rng)?;", delay: 10900, type: 'code' },
    { line: "    Ok(proof)", delay: 11300, type: 'code' },
    { line: "}", delay: 11700, type: 'code' },
    { line: "[INFO] Generating zero-knowledge proof...", delay: 12300, type: 'output' },
    { line: "[PROGRESS] Circuit verification: 45% complete", delay: 13000, type: 'output' },
    { line: "[PROGRESS] Proof generation: 78% complete", delay: 13700, type: 'output' },
    { line: "[SUCCESS] ZK proof generated in 2.3s", delay: 14400, type: 'output' },
    { line: "zkx401@mainnet:~$ ./zkx401-cli sync --blocks 1000", delay: 15100, type: 'command' },
    { line: "[INFO] Syncing blockchain data...", delay: 15800, type: 'output' },
    { line: "[SYNC] Block 15,847 - ZKx401 transaction #1,243,892", delay: 16500, type: 'output' },
    { line: "[SYNC] Processing confidential payments...", delay: 17200, type: 'output' },
    { line: "#[derive(Serialize, Deserialize)]", delay: 17900, type: 'comment' },
    { line: "pub struct ConfidentialPayment {", delay: 18200, type: 'code' },
    { line: "    pub commitment: FieldElement,", delay: 18600, type: 'code' },
    { line: "    pub proof: ZKProof,", delay: 19000, type: 'code' },
    { line: "    pub encrypted_amount: Encryption,", delay: 19400, type: 'code' },
    { line: "}", delay: 19800, type: 'code' },
    { line: "[SYNC] Block 15,848 - Privacy score updated", delay: 20400, type: 'output' },
    { line: "[SYNC] Block 15,849 - DeFi integration detected", delay: 21100, type: 'output' },
    { line: "[PROGRESS] Blockchain sync: 67% complete", delay: 21800, type: 'output' },
    { line: "zkx401@mainnet:~$ ./zkx401-cli status", delay: 22500, type: 'command' },
    { line: "Node Status: SYNCHRONIZED", delay: 23200, type: 'output' },
    { line: "Active Facilitators: 847", delay: 23900, type: 'output' },
    { line: "ZK Circuits Verified: 100%", delay: 24600, type: 'output' },
    { line: "Confidential Transactions: Active", delay: 25300, type: 'output' },
    { line: "Privacy Score: 94.7/100", delay: 26000, type: 'output' },
    { line: "[SUCCESS] ZKx401 Dashboard Ready", delay: 26700, type: 'output' },
    { line: "zkx401@mainnet:~$ Loading dashboard interface...", delay: 27400, type: 'command' },
    { line: "[INIT] Rendering components...", delay: 28100, type: 'output' },
    { line: "[LOAD] NetworkMonitor: SUCCESS", delay: 28800, type: 'output' },
    { line: "[LOAD] FacilitatorComparison: SUCCESS", delay: 29500, type: 'output' },
    { line: "[LOAD] UseCasesSection: SUCCESS", delay: 30200, type: 'output' },
    { line: "[LOAD] IntegrationWizard: SUCCESS", delay: 30900, type: 'output' },
    { line: "", delay: 31600, type: 'output' },
    { line: "🚀 ZKx401 Professional Dashboard Loading...", delay: 32300, type: 'output' },
    { line: "🎯 Ultra-clean design initialized", delay: 33000, type: 'output' },
    { line: "⚡ Performance optimized", delay: 33700, type: 'output' },
    { line: "🔒 Privacy-first architecture", delay: 34400, type: 'output' },
    { line: "✨ World-class UI/UX standards", delay: 35100, type: 'output' },
    { line: "", delay: 35800, type: 'output' },
    { line: "Redirecting to dashboard in 5 seconds...", delay: 36500, type: 'output' },
    { line: "5", delay: 38000, type: 'output' },
    { line: "4", delay: 39000, type: 'output' },
    { line: "3", delay: 40000, type: 'output' },
    { line: "2", delay: 41000, type: 'output' },
    { line: "1", delay: 42000, type: 'output' },
    { line: "✅ Redirecting to main dashboard...", delay: 43000, type: 'output' },
  ];

  return bootSequence;
};

interface BootTerminalProps {
  onComplete: () => void;
}

export const BootTerminal: React.FC<BootTerminalProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<CodeLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const codeSequence = useRef(generateBootCode());

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLineIndex < codeSequence.current.length) {
        setVisibleLines(prev => [...prev, codeSequence.current[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
        
        // Auto-scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        // After all lines, wait and complete
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, currentLineIndex === 0 ? 100 : codeSequence.current[currentLineIndex - 1]?.delay || 500);

    return () => clearTimeout(timer);
  }, [currentLineIndex, onComplete]);

  const getLineStyle = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-cyan-400';
      case 'output':
        return 'text-gray-300';
      case 'comment':
        return 'text-yellow-400 italic';
      case 'code':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        <div className="w-full max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Terminal Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-gray-400 text-sm font-mono">
                  ZKx401 Protocol Terminal v2.1.0
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              ref={terminalRef}
              className="h-96 overflow-y-auto p-6 font-mono text-sm"
            >
              {visibleLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${getLineStyle(line.type)} mb-1 break-words`}
                >
                  {line.line}
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-white"
              >
                |
              </motion.span>
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div 
            className="mt-6 flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-cyan-400 text-sm font-mono">
              Loading Progress:
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${(currentLineIndex / codeSequence.current.length) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-cyan-400 text-sm font-mono">
              {Math.round((currentLineIndex / codeSequence.current.length) * 100)}%
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};