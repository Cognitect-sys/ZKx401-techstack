/**
 * Simplified Payment Context for ZKx401 Demo
 * Handles USDC micropayments via x402 protocol on Solana
 */

import { BaseContext } from '../core/actions.js';

export interface PaymentState {
  transactions: Map<string, any>;
  paymentHistory: Map<string, any>;
  feeEstimates: Map<string, any>;
  balances: Map<string, number>;
}

export class PaymentContext implements BaseContext {
  public readonly id = 'payment';
  public readonly name = 'Payment Context';
  public readonly description = 'Handles USDC micropayments via x402 protocol on Solana';
  
  private state: PaymentState;
  private memoryManager: any;
  private readonly NETWORK_FEE_SOL = 0.000005;

  constructor(memoryManager: any) {
    this.memoryManager = memoryManager;
    this.state = {
      transactions: new Map(),
      paymentHistory: new Map(),
      feeEstimates: new Map(),
      balances: new Map()
    };
    
    this.initializeActions();
    this.loadPersistedState();
  }

  private initializeActions(): void {
    console.log('Payment context actions initialized');
  }

  private async loadPersistedState(): Promise<void> {
    try {
      const transactions = await this.memoryManager.getContextMemory(this.id, 'transactions');
      const balances = await this.memoryManager.getContextMemory(this.id, 'balances');

      if (transactions) this.state.transactions = new Map(Object.entries(transactions));
      if (balances) this.state.balances = new Map(Object.entries(balances));
    } catch (error) {
      console.warn('Failed to load payment context state:', error);
    }
  }

  private async persistState(): Promise<void> {
    try {
      await this.memoryManager.setContextMemory(this.id, 'transactions', Object.fromEntries(this.state.transactions));
      await this.memoryManager.setContextMemory(this.id, 'balances', Object.fromEntries(this.state.balances));
    } catch (error) {
      console.warn('Failed to persist payment context state:', error);
    }
  }

  async initialize(): Promise<void> {
    this.memoryManager.activateContext(this.id);
    await this.initializeBalances();
    console.log('Payment Context initialized');
  }

  async cleanup(): Promise<void> {
    await this.persistState();
    this.memoryManager.deactivateContext(this.id);
    console.log('Payment Context cleaned up');
  }

  private async initializeBalances(): Promise<void> {
    if (this.state.balances.size === 0) {
      this.state.balances.set('demo_wallet_sol', 10.0);
      this.state.balances.set('demo_wallet_usdc', 1000.0);
    }
  }

  async processPayment(payload: any, context: any): Promise<any> {
    try {
      const { amount, currency, recipient, metadata = {} } = payload;
      
      const balance = this.state.balances.get('demo_wallet_' + currency.toLowerCase()) || 0;
      if (balance < amount) {
        throw new Error(`Insufficient ${currency} balance. Required: ${amount}, Available: ${balance}`);
      }

      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const transaction = {
        id: transactionId,
        type: 'payment',
        amount,
        currency,
        recipient,
        sender: 'demo_wallet',
        status: 'pending',
        metadata,
        timestamp: new Date(),
        network: 'solana',
        protocol: 'x402'
      };

      await this.simulateTransactionProcessing(transaction);
      
      const newBalance = balance - amount;
      this.state.balances.set('demo_wallet_' + currency.toLowerCase(), newBalance);
      
      this.state.transactions.set(transactionId, transaction);
      this.state.paymentHistory.set(transactionId, {
        ...transaction,
        status: 'completed',
        completedAt: new Date()
      });

      await this.persistState();
      
      console.log(`Payment processed: ${transactionId} - ${amount} ${currency} to ${recipient}`);
      
      return {
        success: true,
        transactionId,
        status: 'completed',
        amount,
        currency,
        recipient,
        network: 'solana',
        estimatedConfirmation: '2-5 seconds'
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error(`Payment failed: ${error}`);
    }
  }

  async estimateFees(payload: any, context: any): Promise<any> {
    try {
      const { amount, tokenAddress, priority } = payload;
      
      const baseFee = this.NETWORK_FEE_SOL;
      const priorityMultiplier = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
      const totalFee = baseFee * priorityMultiplier;
      const estimatedGas = amount > 100 ? totalFee * 1.5 : totalFee;
      
      const estimate = {
        networkFee: totalFee,
        estimatedGas,
        totalCost: estimatedGas,
        currency: 'SOL',
        priority,
        estimatedTime: priority === 'high' ? '1-2s' : priority === 'medium' ? '2-5s' : '5-15s',
        confidence: 'high'
      };

      this.state.feeEstimates.set(`${tokenAddress}_${priority}`, estimate);
      
      return {
        success: true,
        ...estimate
      };
    } catch (error) {
      console.error('Fee estimation failed:', error);
      throw new Error(`Fee estimation failed: ${error}`);
    }
  }

  async getBalance(payload: any, context: any): Promise<any> {
    try {
      const { address, currency = 'SOL' } = payload;
      
      const balance = this.state.balances.get(`${address}_${currency.toLowerCase()}`) || 0;
      
      return {
        success: true,
        address,
        currency,
        balance,
        formattedBalance: `${balance.toLocaleString()} ${currency}`,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Balance retrieval failed:', error);
      throw new Error(`Balance retrieval failed: ${error}`);
    }
  }

  async getPaymentHistory(payload: any, context: any): Promise<any> {
    try {
      const { address, limit = 10 } = payload;
      
      let history = Array.from(this.state.paymentHistory.values());
      
      if (address) {
        history = history.filter(tx => 
          tx.sender === address || tx.recipient === address
        );
      }
      
      history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      history = history.slice(0, limit);
      
      return {
        success: true,
        transactions: history,
        totalCount: history.length,
        hasMore: this.state.paymentHistory.size > limit
      };
    } catch (error) {
      console.error('Payment history retrieval failed:', error);
      throw new Error(`Payment history retrieval failed: ${error}`);
    }
  }

  private async simulateTransactionProcessing(transaction: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    transaction.status = 'completed';
    transaction.confirmedAt = new Date();
    transaction.signature = `sig_${Buffer.from(JSON.stringify(transaction)).toString('hex').substr(0, 44)}`;
  }

  getStatistics() {
    const transactions = Array.from(this.state.paymentHistory.values());
    const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const currencies = Array.from(new Set(transactions.map(tx => tx.currency)));
    const averageFee = transactions.length > 0 ? this.NETWORK_FEE_SOL : 0;
    
    return {
      totalTransactions: transactions.length,
      totalVolume,
      currencies,
      averageFee
    };
  }

  use<T extends BaseContext>(context: T): T & PaymentContext {
    return Object.assign(context, this);
  }
}

export default PaymentContext;