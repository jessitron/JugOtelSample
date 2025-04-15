import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const useWebSocket = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    //ws.current = new WebSocket(`ws://${window.location.host}/api/chat`);
    // TODO - externalize this
    ws.current = new WebSocket(`ws://localhost:8080/gs-guide-websocket`);

    ws.current.onopen = () => {
      setIsConnected(true);
      setMessages(prev => [...prev, {
        content: 'Hello! How can I help you today?',
        sender: 'assistant',
        timestamp: new Date()
      }]);
    };

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, {
        content: event.data,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (ws.current && isConnected) {
      ws.current.send(message);
      setMessages(prev => [...prev, {
        content: message,
        sender: 'user',
        timestamp: new Date()
      }]);
    }
  };

  return { messages, sendMessage, isConnected };
}; 