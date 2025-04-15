import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const useWebSocket = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    // Initialize STOMP client
    const client = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket',
      onConnect: () => {
        setIsConnected(true);
        setMessages(prev => [...prev, {
          content: 'Hello! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date()
        }]);

        // Subscribe to the response topic
        client.subscribe('/topic/hello', (message) => {
          try {
            const response = JSON.parse(message.body);
            setMessages(prev => [...prev, {
              content: response.response,
              sender: 'assistant',
              timestamp: new Date()
            }]);
          } catch (error) {
            console.error('Error parsing STOMP message:', error);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (stompClient.current && isConnected) {
      const messageObj = {
        name: message
      };
      stompClient.current.publish({
        destination: '/app/hello',
        body: JSON.stringify(messageObj)
      });
      setMessages(prev => [...prev, {
        content: message,
        sender: 'user',
        timestamp: new Date()
      }]);
    }
  };

  return { messages, sendMessage, isConnected };
}; 