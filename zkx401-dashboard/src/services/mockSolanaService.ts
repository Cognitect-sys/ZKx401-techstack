// Mock Solana Service for build compatibility
export interface TransactionResult {
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  amount: number;
  blockHeight: number;
  fee: number;
}

export interface ZKProofData {
  proofHash: string;
  publicInputs: string[];
  verificationKey?: string;
}

export interface OnchainVerificationResult {
  isValid: boolean;
  transaction: TransactionResult | null;
  zkProof: ZKProofData | null;
  verificationTime: number;
}

class MockSolanaService {
  async verifyTransaction(signature: string): Promise<TransactionResult | null> {
    // Mock implementation
    return {
      signature,
      status: 'confirmed',
      timestamp: Date.now(),
      amount: 100,
      blockHeight: 1000000,
      fee: 0.000005
    };
  }

  async verifyZKProof(proofData: ZKProofData): Promise<{ isValid: boolean; verificationTime: number }> {
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      isValid: true,
      verificationTime: Date.now() - startTime
    };
  }
}

export const solanaService = new MockSolanaService();
