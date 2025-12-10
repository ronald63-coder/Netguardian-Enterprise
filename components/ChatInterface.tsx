import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAnalyst } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'NetGuardian AI Analyst online. I can assist with threat analysis, report generation, or WAF configuration.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (excluding the just added message which is passed as 'message')
      const history = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));
      
      const responseText = await chatWithAnalyst(input, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-cyber-800 border border-cyber-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-cyber-700 bg-cyber-900 flex items-center space-x-3">
        <div className="p-2 rounded-full bg-cyber-accent/10 border border-cyber-accent/30">
          <Bot className="w-5 h-5 text-cyber-accent" />
        </div>
        <div>
          <h3 className="font-bold text-gray-100">Gemini Security Analyst</h3>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-400">Online | Gemini 3 Pro</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyber-900/50" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'assistant'
                  ? 'bg-cyber-700 text-gray-200 border border-cyber-600'
                  : 'bg-cyber-accent/20 text-emerald-100 border border-cyber-accent/30'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-cyber-700 p-3 rounded-lg border border-cyber-600">
               <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-cyber-800 border-t border-cyber-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about threats, generate reports, or analyze IP..."
            className="flex-1 bg-cyber-900 border border-cyber-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-cyber-accent hover:bg-emerald-600 text-cyber-900 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
