import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeLine {
  line: string;
  delay: number;
  type: 'command' | 'output' | 'comment' | 'code';
}

const generateBootCode = (): CodeLine[] => {
  const codeLines: CodeLine[] = [];
  
  // ZKx401 Rust-First Blockchain initialization code
  const bootSequence: CodeLine[] = [
    { line: "[INFO] Initializing ZKx401 Protocol...", delay: 150, type: 'output' },
    { line: "zkx401@mainnet:~$ Loading ZKx401 framework...", delay: 300, type: 'command' },
    { line: "Framework loaded successfully.", delay: 500, type: 'output' },
    { line: "// Rust Zero-Knowledge Proof Generation", delay: 700, type: 'comment' },
    { line: "use ark_groth16::{ProvingKey, VerifyingKey, Proof};", delay: 900, type: 'code' },
    { line: "use ark_bn254::{Bn254, Fr as Field};", delay: 1100, type: 'code' },
    { line: "use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};", delay: 1300, type: 'code' },
    { line: "use rand::{rngs::StdRng, SeedableRng};", delay: 1500, type: 'code' },
    { line: "", delay: 1700, type: 'output' },
    { line: "pub struct ZKx401Circuit {", delay: 1900, type: 'code' },
    { line: "    pub secret_key: Field,", delay: 2100, type: 'code' },
    { line: "    pub commitment: Field,", delay: 2300, type: 'code' },
    { line: "    pub nullifier: Field,", delay: 2500, type: 'code' },
    { line: "}", delay: 2700, type: 'code' },
    { line: "", delay: 2900, type: 'output' },
    { line: "fn generate_zk_proof(circuit: &ZKx401Circuit) -> Result<Proof<Bn254>> {", delay: 3100, type: 'code' },
    { line: "    let mut rng = StdRng::from_entropy();", delay: 3300, type: 'code' },
    { line: "    let pk = setup_circuit::<Bn254>(&circuit, &mut rng)?;", delay: 3500, type: 'code' },
    { line: "    let proof = groth16::prove(&pk, &circuit, &mut rng)?;", delay: 3700, type: 'code' },
    { line: "    Ok(proof)", delay: 3900, type: 'code' },
    { line: "}", delay: 4100, type: 'code' },
    { line: "", delay: 4300, type: 'output' },
    { line: "[COMPILATION] Rust ZK circuits compiled successfully", delay: 4500, type: 'output' },
    { line: "[INFO] Generating zero-knowledge proof...", delay: 4700, type: 'output' },
    { line: "[PROGRESS] Circuit verification: 67% complete", delay: 4900, type: 'output' },
    { line: "[PROGRESS] Proof generation: 89% complete", delay: 5100, type: 'output' },
    { line: "[SUCCESS] ZK proof generated in 1.2s", delay: 5300, type: 'output' },
    { line: "", delay: 5500, type: 'output' },
    { line: "// Solana Integration Layer", delay: 5700, type: 'comment' },
    { line: "use solana_program::{program_error::ProgramError};", delay: 5900, type: 'code' },
    { line: "use solana_sdk::{transaction::VersionedTransaction};", delay: 6100, type: 'code' },
    { line: "", delay: 6300, type: 'output' },
    { line: "zkx401@mainnet:~$ ./zkx401-cli initialize --network testnet", delay: 6500, type: 'command' },
    { line: "[INFO] Connecting to Solana RPC endpoints...", delay: 6700, type: 'output' },
    { line: "[SUCCESS] Connected to 12 RPC endpoints", delay: 6900, type: 'output' },
    { line: "[SYNC] Connecting to testnet environment...", delay: 7100, type: 'output' },
    { line: "[SYNC] Processing confidential payments...", delay: 7300, type: 'output' },
    { line: "[PROGRESS] Blockchain sync: 94% complete", delay: 7500, type: 'output' },
    { line: "zkx401@mainnet:~$ ./zkx401-cli status", delay: 7700, type: 'command' },
    { line: "Node Status: SYNCHRONIZED", delay: 7900, type: 'output' },
    { line: "Network Status: Ready", delay: 8100, type: 'output' },
    { line: "ZK Circuits Verified: 100%", delay: 8300, type: 'output' },
    { line: "Privacy Score: 94.7/100", delay: 8500, type: 'output' },
    { line: "", delay: 8700, type: 'output' },
    { line: "[SUCCESS] ZKx401 Dashboard Ready", delay: 8900, type: 'output' },
    { line: "zkx401@mainnet:~$ Loading dashboard interface...", delay: 9100, type: 'command' },
    { line: "[INIT] Rendering components...", delay: 9300, type: 'output' },
    { line: "[LOAD] NetworkMonitor: SUCCESS", delay: 9500, type: 'output' },
    { line: "[LOAD] FacilitatorComparison: SUCCESS", delay: 9700, type: 'output' },
    { line: "[LOAD] UseCasesSection: SUCCESS", delay: 9900, type: 'output' },
    { line: "[LOAD] IntegrationWizard: SUCCESS", delay: 10100, type: 'output' },
    { line: "", delay: 10300, type: 'output' },
    { line: "🚀 ZKx401 Professional Dashboard Loading...", delay: 10500, type: 'output' },
    { line: "🎯 Rust-powered ZK cryptography initialized", delay: 10700, type: 'output' },
    { line: "⚡ Ultra-clean performance optimized", delay: 10900, type: 'output' },
    { line: "🔒 Privacy-first architecture active", delay: 11100, type: 'output' },
    { line: "✨ World-class UI/UX standards ready", delay: 11300, type: 'output' },
    { line: "", delay: 11500, type: 'output' },
    { line: "Redirecting to dashboard in 2 seconds...", delay: 11700, type: 'output' },
    { line: "2", delay: 12300, type: 'output' },
    { line: "1", delay: 12900, type: 'output' },
    { line: "✅ Redirecting to main dashboard...", delay: 13500, type: 'output' },
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

  // ESC key to skip boot animation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onComplete]);

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
        }, 1000);
      }
    }, currentLineIndex === 0 ? 50 : codeSequence.current[currentLineIndex - 1]?.delay || 200);

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

          {/* ESC Skip indicator */}
          <motion.div 
            className="mt-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="text-gray-500 text-sm font-mono">
              Press <span className="text-yellow-400 font-bold">ESC</span> to skip
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};