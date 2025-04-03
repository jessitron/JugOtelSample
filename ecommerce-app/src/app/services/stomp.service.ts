import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { trace, context, Span } from '@opentelemetry/api';

const tracer = trace.getTracer('stomp-service');

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
    const rootSpan = tracer.startActiveSpan('ws::initialize', (span: Span) => {
      try {
        this.stompClient = new Client({
          brokerURL: 'ws://localhost:8080/gs-guide-websocket', // Ensure this URL matches your server's WebSocket endpoint
          reconnectDelay: 5000, // Auto-reconnect after 5 seconds
        });

        this.stompClient.onConnect = () => {
          console.log('Connected to STOMP WebSocket');
          this.subscribeToTopic();
        };

        this.stompClient.onStompError = (frame: any) => {
          console.error('Broker reported error: ' + frame.headers['message']);
        };

        this.stompClient.activate(); // Start the connection
      } finally {
        span.end();
      }
    });
  }

  private subscribeToTopic(): void {
    this.stompClient?.subscribe('/topic/hello', (message: any) => {
      this.messageSubject.next(message.body);
    });
  }

  sendMessage(name: string): void {
    const rootSpan = tracer.startActiveSpan('ws::sendMessage', (span: Span) => {
      // manually propagate to websocket
      const { traceId, spanId } = span.spanContext();
      try {
        if (this.stompClient && this.stompClient.connected) {
          // create a traceparent header based on the current context
          const traceparent = `00-${traceId}-${spanId}-01`;
          this.stompClient.publish({
            destination: '/app/hello',
            body: JSON.stringify({ name }),
            // pass trace context into header as a traceparent
            headers: { traceparent }
          });
        } else {
          console.error('STOMP client is not connected.');
        }
      } finally {
        span.end();
      }
    });
  }
} 