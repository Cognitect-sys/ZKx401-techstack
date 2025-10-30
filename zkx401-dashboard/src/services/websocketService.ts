import { apiService } from './apiService';

export interface WebSocketMessage {
  type: 'transaction' | 'block' | 'stats' | 'price' | 'activity';
  data: any;
  timestamp: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isConnected = false;
  private pingInterval: NodeJS.Timeout | null = null;

  // Solana WebSocket endpoints (public endpoints)
  private readonly solanaWSEndpoints = [
    'wss://api.solana.com',
    'wss://solana-api.projectserum.com',
    'wss://rpc.ankr.com/solana'
  ];

  // CoinGecko WebSocket for real-time price updates
  private readonly priceWSEndpoint = 'wss://ws.coincap.io/prices?assets=usd-coin';

  async connect(endpoint?: string): Promise<void> {
    try {
      const wsUrl = endpoint || this.solanaWSEndpoints[0];
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startPingInterval();
        this.setupSubscriptions();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.stopPingInterval();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private setupSubscriptions(): void {
    if (!this.ws || !this.isConnected) return;

    // Subscribe to account changes (transactions)
    const subscription = {
      jsonrpc: '2.0',
      id: 1,
      method: 'accountSubscribe',
      params: [
        '11111111111111111111111111111111', // System program
        {
          encoding: 'jsonParsed',
        },
      ],
    };

    this.ws.send(JSON.stringify(subscription));
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  private handleMessage(message: any): void {
    // Handle different message types
    if (message.method === 'accountNotification') {
      // Process transaction data
      this.notifyHandlers('transaction', message.params.result.value);
    } else if (message.result) {
      // Handle subscription confirmations
      this.notifyHandlers('subscription', message.result);
    }
  }

  private notifyHandlers(type: string, data: any): void {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  // Subscribe to message types
  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Unsubscribe from message types
  offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  // Close WebSocket connection
  disconnect(): void {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.messageHandlers.clear();
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Send subscription request
  subscribeToAccount(accountAddress: string): void {
    if (!this.ws || !this.isConnected) return;

    const subscription = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'accountSubscribe',
      params: [
        accountAddress,
        {
          encoding: 'jsonParsed',
        },
      ],
    };

    this.ws.send(JSON.stringify(subscription));
  }

  // Unsubscribe from account
  unsubscribeFromAccount(subscriptionId: number): void {
    if (!this.ws || !this.isConnected) return;

    const unsubscription = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'accountUnsubscribe',
      params: [subscriptionId],
    };

    this.ws.send(JSON.stringify(unsubscription));
  }

  // Create a mock real-time data feed for demo purposes
  // In production, this would connect to actual Solana WebSocket
  startMockRealTimeFeed(): void {
    console.log('Starting mock real-time feed...');
    
    // Simulate real-time transaction data
    setInterval(() => {
      const mockTransaction = {
        signature: this.generateMockSignature(),
        blockTime: Date.now() / 1000,
        fee: 5000, // 0.000005 SOL
        slot: Math.floor(Math.random() * 1000) + 294567000,
        accounts: [
          '11111111111111111111111111111112', // System program
          '11111111111111111111111111111113', // Fee program
        ],
      };

      this.notifyHandlers('transaction', mockTransaction);
    }, 3000);

    // Simulate price updates
    setInterval(async () => {
      try {
        const price = await apiService.getUSDCPrice();
        this.notifyHandlers('price', price);
      } catch (error) {
        console.error('Error fetching price for real-time update:', error);
      }
    }, 5000);

    // Simulate network stats updates
    setInterval(async () => {
      try {
        const stats = await apiService.getSolanaNetworkStats();
        this.notifyHandlers('stats', stats);
      } catch (error) {
        console.error('Error fetching stats for real-time update:', error);
      }
    }, 10000);

    // Simulate activity feed
    setInterval(() => {
      const activities = apiService.generateLiveTransactionActivity();
      activities.forEach(activity => {
        this.notifyHandlers('activity', activity);
      });
    }, 4000);
  }

  private generateMockSignature(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const wsService = new WebSocketService();