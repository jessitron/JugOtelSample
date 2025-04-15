import { useWebSocket } from '../services/websocket.service';
import { useEffect, useRef, useState } from 'react';
import { withSpan } from '../lib/tracing';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    const loadChat = () => {
      withSpan('ChatPage', 'loadChat', async () => {
        // Initial connection is handled by useWebSocket
      }, { 'page': 'chat' });
    };
    
    loadChat();
  }, []);

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

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Connecting to chat...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Chat with Support</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-indigo-600 text-white ml-auto rounded-br-none' 
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
            
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  disabled={!isConnected}
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={!isConnected}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 