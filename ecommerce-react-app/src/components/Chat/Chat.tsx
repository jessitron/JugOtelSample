import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../services/websocket.service';

export const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    console.log('Chat component mounted');
    console.log('WebSocket connected:', isConnected);
    console.log('Messages:', messages);
  }, [isConnected, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          💬
        </button>
      )}
      
      <div 
        className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-lg">
          <h3 className="text-lg font-medium">Chat with Support</h3>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-xl hover:bg-blue-700 rounded-full p-1"
          >
            ×
          </button>
        </div>
        
        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                {isConnected ? 'No messages yet' : 'Connecting to chat...'}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white ml-auto rounded-br-none' 
                      : 'bg-gray-100 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="text-xs opacity-80 mb-1">
                    {message.sender === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="break-words">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                disabled={!isConnected}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!isConnected}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}; 