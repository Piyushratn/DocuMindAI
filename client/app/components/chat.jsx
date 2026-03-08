'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

const ChatComponent = () => {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef(null);

  // 🔥 Auto-scroll to latest message
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(message)}`
      );

      const data = await res.json();

      const assistantMessage = {
        role: 'assistant',
        content: data?.message || 'No response received.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Backend error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendChatMessage();
    }
  };

  return (
    <div className="flex flex-col h-full text-white">

      {/* 🔥 Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-300 text-center animate-fadeIn">
            <p className="text-2xl font-semibold mb-2">
              Ask anything about your document
            </p>
            <p className="text-sm text-gray-400">
              Upload a PDF and start intelligent conversation ✨
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-md animate-fadeIn ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-white/10 border border-white/20 backdrop-blur-md'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {/* 🔥 Typing Indicator */}
        {loading && (
          <div className="flex gap-2 px-4 py-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 🔥 Input Area */}
      <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-xl">
        <div className="flex gap-3 items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your document..."
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 rounded-xl"
          />
          <Button
            onClick={handleSendChatMessage}
            disabled={!message.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl transition"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
