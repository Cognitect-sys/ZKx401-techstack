/**
 * Simplified Blockchain Context for ZKx401 Demo
 * Handles Solana blockchain operations, contract deployment, and transaction management
 */

import { BaseContext } from '../core/actions.js';

export interface BlockchainState {
  contracts: Map<string, any>;
  transactions: Map<string, any>;
  networks: Map<string, any>;
  programAccounts: Map<string, any>;
}

export class BlockchainContext implements BaseContext {
  public readonly id = 'blockchain';
  public readonly name = 'Blockchain Context';
  public readonly description = 'Handles Solana blockchain operations and smart contracts';
  
  private state: BlockchainState;
  private memoryManager: any;
  private readonly SUPPORTED_NETWORKS = {
    'solana-mainnet': { name: 'Solana Mainnet', explorer: 'https://explorer.solana.com' },
    'solana-devnet': { name: 'Solana Devnet', explorer: 'https://explorer.solana.com/?cluster=devnet' },
    'solana-testnet': { name: 'Solana Testnet', explorer: 'https://explorer.solana.com/?cluster=testnet' }
  };

  constructor(memoryManager: any) {
    this.memoryManager = memoryManager;
    this.state = {
      contracts: new Map(),
      transactions: new Map(),
      networks: new Map(),
      programAccounts: new Map()
    };
    
    this.initializeActions();
    this.loadPersistedState();
  }

  private initializeActions(): void {
    console.log('Blockchain context actions initialized');
  }

  private async loadPersistedState(): Promise<void> {
    try {
      const contracts = await this.memoryManager.getContextMemory(this.id, 'contracts');
      const networks = await this.memoryManager.getContextMemory(this.id, 'networks');

      if (contracts) this.state.contracts = new Map(Object.entries(contracts));
      if (networks) this.state.networks = new Map(Object.entries(networks));
    } catch (error) {
      console.warn('Failed to load blockchain context state:', error);
    }
  }

  private async persistState(): Promise<void> {
    try {
      await this.memoryManager.setContextMemory(this.id, 'contracts', Object.fromEntries(this.state.contracts));
      await this.memoryManager.setContextMemory(this.id, 'networks', Object.fromEntries(this.state.networks));
    } catch (error) {
      console.warn('Failed to persist blockchain context state:', error);
    }
  }

  async initialize(): Promise<void> {
    this.memoryManager.activateContext(this.id);
    await this.initializeNetworks();
    console.log('Blockchain Context initialized');
  }

  async cleanup(): Promise<void> {
    await this.persistState();
    this.memoryManager.deactivateContext(this.id);
    console.log('Blockchain Context cleaned up');
  }

  private async initializeNetworks(): Promise<void> {
    for (const [networkId, network] of Object.entries(this.SUPPORTED_NETWORKS)) {
      this.state.networks.set(networkId, {
        id: networkId,
        name: network.name,
        status: 'connected',
        blockHeight: Math.floor(Math.random() * 1000000) + 200000000,
        tps: Math.floor(Math.random() * 3000) + 1000,
        slot: Math.floor(Math.random() * 100000) + 250000000,
        epoch: Math.floor(Math.random() * 1000) + 500,
        lastUpdated: new Date()
      });
    }
  }

  async deployContract(payload: any, context: any): Promise<any> {
    try {
      const { code, constructorArgs, networkId } = payload;
      
      if (!this.SUPPORTED_NETWORKS[networkId as keyof typeof this.SUPPORTED_NETWORKS]) {
        throw new Error(`Unsupported network: ${networkId}`);
      }

      const contractAddress = this.generateSolanaAddress();
      const programId = this.generateProgramId();
      
      const contract = {
        address: contractAddress,
        programId,
        network: networkId,
        code: code.substring(0, 100) + '...',
        constructorArgs,
        status: 'deploying',
        deployedAt: new Date(),
        creator: 'zkx401_demo',
        bytecode: code
      };

      await this.simulateContractDeployment(contract);
      
      this.state.contracts.set(contractAddress, contract);
      
      await this.persistState();
      
      console.log(`Contract deployed: ${contractAddress} on ${networkId}`);
      
      return {
        success: true,
        contractAddress,
        programId,
        network: networkId,
        status: 'deployed',
        explorerUrl: `${this.SUPPORTED_NETWORKS[networkId as keyof typeof this.SUPPORTED_NETWORKS].explorer}/address/${contractAddress}`,
        deploymentTime: Date.now() - contract.deployedAt.getTime()
      };
    } catch (error) {
      console.error('Contract deployment failed:', error);
      throw new Error(`Contract deployment failed: ${error}`);
    }
  }

  async executeTransaction(payload: any, context: any): Promise<any> {
    try {
      const { to, data, value, gasLimit } = payload;
      
      const transactionId = this.generateTransactionSignature();
      
      const transaction = {
        signature: transactionId,
        from: 'zkx401_demo',
        to,
        data,
        value: value || '0',
        gasLimit: gasLimit || '200000',
        status: 'pending',
        createdAt: new Date(),
        network: 'solana-mainnet',
        type: 'smart_contract_call'
      };

      await this.simulateTransactionExecution(transaction);
      
      this.state.transactions.set(transactionId, transaction);
      
      await this.persistState();
      
      console.log(`Transaction executed: ${transactionId}`);
      
      return {
        success: true,
        signature: transactionId,
        status: 'confirmed',
        network: 'solana-mainnet',
        explorerUrl: `https://explorer.solana.com/tx/${transactionId}`,
        confirmations: 32,
        slot: Math.floor(Math.random() * 1000) + 250000000
      };
    } catch (error) {
      console.error('Transaction execution failed:', error);
      throw new Error(`Transaction execution failed: ${error}`);
    }
  }

  async getNetworkStatus(payload: any, context: any): Promise<any> {
    try {
      const { networkId } = payload;
      
      if (networkId) {
        const network = this.state.networks.get(networkId);
        if (!network) {
          throw new Error(`Network not found: ${networkId}`);
        }
        
        return {
          success: true,
          network
        };
      } else {
        return {
          success: true,
          networks: Array.from(this.state.networks.values())
        };
      }
    } catch (error) {
      console.error('Network status retrieval failed:', error);
      throw new Error(`Network status retrieval failed: ${error}`);
    }
  }

  async getContractInfo(payload: any, context: any): Promise<any> {
    try {
      const { address } = payload;
      
      const contract = this.state.contracts.get(address);
      if (!contract) {
        throw new Error(`Contract not found: ${address}`);
      }

      return {
        success: true,
        contract: {
          ...contract,
          bytecode: undefined
        }
      };
    } catch (error) {
      console.error('Contract info retrieval failed:', error);
      throw new Error(`Contract info retrieval failed: ${error}`);
    }
  }

  async getTransactionHistory(payload: any, context: any): Promise<any> {
    try {
      const { address, limit = 10 } = payload;
      
      let transactions = Array.from(this.state.transactions.values());
      
      if (address) {
        transactions = transactions.filter(tx => 
          tx.from === address || tx.to === address
        );
      }
      
      transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      transactions = transactions.slice(0, limit);
      
      return {
        success: true,
        transactions,
        totalCount: transactions.length
      };
    } catch (error) {
      console.error('Transaction history retrieval failed:', error);
      throw new Error(`Transaction history retrieval failed: ${error}`);
    }
  }

  private generateSolanaAddress(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let result = '';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateProgramId(): string {
    return this.generateSolanaAddress();
  }

  private generateTransactionSignature(): string {
    return this.generateSolanaAddress();
  }

  private async simulateContractDeployment(contract: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 2000));
    
    contract.status = 'deployed';
    contract.deploymentSignature = this.generateTransactionSignature();
    contract.deployedAt = new Date();
  }

  private async simulateTransactionExecution(transaction: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    transaction.status = 'confirmed';
    transaction.confirmedAt = new Date();
    transaction.confirmations = 32;
  }

  getStatistics() {
    const contracts = Array.from(this.state.contracts.values()).filter(c => c.status === 'deployed');
    const networks = Array.from(this.state.networks.values()).filter(n => n.status === 'connected');
    
    return {
      contractsCount: contracts.length,
      transactionsCount: this.state.transactions.size,
      networksCount: networks.length,
      activeNetworks: networks.map(n => n.id)
    };
  }

  use<T extends BaseContext>(context: T): T & BlockchainContext {
    return Object.assign(context, this);
  }
}

export default BlockchainContext;