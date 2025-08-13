interface ProductUpdateMessage {
  type: 'product_update';
  data: {
    id: string;
    name: string;
    currentBid: number;
    auction_end: string;
    image_path?: string;
    [key: string]: unknown;
  };
}

type WebSocketMessage = ProductUpdateMessage | { type: string; [key: string]: unknown };
type WebSocketMessageHandler = (message: WebSocketMessage) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private messageHandlers: Set<WebSocketMessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string = '';
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(productId: string, onMessage: WebSocketMessageHandler): void {
    if (this.socket) {
      this.disconnect();
    }

    this.url = this.getWebSocketUrl(productId);
    this.isConnecting = true;
    this.addMessageHandler(onMessage);
    this.initializeWebSocket();
  }

  public disconnect(): void {
    this.messageHandlers.clear();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  public addMessageHandler(handler: WebSocketMessageHandler): void {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: WebSocketMessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  private getWebSocketUrl(productId: string): string {
    // Get the base URL and determine the WebSocket protocol
    const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/^https?:\/\//, '');
    const isHttps = window.location.protocol === 'https:';
    const wsProtocol = isHttps ? 'wss' : 'ws';
    
    return `${wsProtocol}://${API_BASE_URL}/ws/product?product_id=${productId}`;
  }

  private initializeWebSocket(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.isConnecting = false;
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log(`WebSocket connected to ${this.url}`);
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.notifyHandlers(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnect();
      };

      this.socket.onclose = () => {
        console.log(`WebSocket connection closed for ${this.url}`);
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.handleReconnect();
    }
  }

  private notifyHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in WebSocket message handler:', error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout || !this.isConnecting) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff with max 30s
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (this.isConnecting) {
        this.initializeWebSocket();
      }
    }, delay);
  }
}

const instance = WebSocketService.getInstance();

export type { WebSocketMessage };
export default instance;