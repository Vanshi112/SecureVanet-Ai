import { CANPacket, VehicleStatus } from '../types';
import { getWebSocketUrl } from './api';

export type WebSocketMessageCallback = (packet: CANPacket, vehicle?: VehicleStatus) => void;
export type WebSocketStatusCallback = (isConnected: boolean, error?: string) => void;

class RealWebSocketService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private messageListeners: WebSocketMessageCallback[] = [];
  private statusListeners: WebSocketStatusCallback[] = [];
  private reconnectTimer: any = null;
  private shouldReconnect = true;

  public connect(url?: string) {
    const wsUrl = url || getWebSocketUrl();
    this.shouldReconnect = true;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ WebSocket Connected");

        this.isConnected = true;
        this.notifyStatus(true);

        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.packet) {
            this.notifyMessage(data.packet, data.vehicle);
          } else if (data.can_id) {
            const packet: CANPacket = {
              id: data.id || `ws-${Date.now()}`,
              timestamp: data.timestamp || new Date().toISOString(),
              can_id: data.can_id,
              dlc: data.dlc || 8,
              payload: data.payload || '',
              prediction: data.prediction || 'Normal',
              attack_type: data.attack_type || 'Normal',
              severity: data.severity || 'Normal',
              confidence: data.confidence || 99.0,
            };
            this.notifyMessage(packet, data.vehicle);
          }
        } catch (e) {
          console.error('[WebSocket] Parsing error:', e);
        }
      };

     this.ws.onerror = (err) => {
      console.error("❌ WebSocket Error", err);

      this.notifyStatus(false, "WebSocket connection failed");
    };

     this.ws.onclose = (event) => {
        console.log("❌ CLOSED", event);

        this.isConnected = false;

        this.notifyStatus(false);

        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (err: any) {
      this.isConnected = false;
      this.notifyStatus(false, err.message || 'Failed to initialize WebSocket');
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    }
  }

  public disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.notifyStatus(false);
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public onMessage(callback: WebSocketMessageCallback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }

  public onStatus(callback: WebSocketStatusCallback) {
    this.statusListeners.push(callback);
    callback(this.isConnected);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== callback);
    };
  }

  private notifyMessage(packet: CANPacket, vehicle?: VehicleStatus) {
    this.messageListeners.forEach(fn => fn(packet, vehicle));
  }

  private notifyStatus(isConnected: boolean, error?: string) {
    this.statusListeners.forEach(fn => fn(isConnected, error));
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        this.connect();
      }
    }, 5000);
  }
}

export const realWebSocketService = new RealWebSocketService();

