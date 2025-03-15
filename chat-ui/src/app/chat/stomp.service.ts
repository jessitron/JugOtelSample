import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  private stompClient: Client|undefined = undefined;
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket', // Ensure this URL matches your server's WebSocket endpoint
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to STOMP WebSocket');
      this.subscribeToTopic();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    this.stompClient.activate(); // Start the connection
  }

  private subscribeToTopic(): void {
    this.stompClient?.subscribe('/topic/hello', (message) => {
      this.messageSubject.next(message.body);
    });
  }

  sendMessage(name: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/hello',
        body: JSON.stringify({ name }),
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }
}
