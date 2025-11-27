
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, Sparkles, Globe, MapPin, ArrowRight } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Halo! Saya asisten AI MetalOS. Ada yang bisa saya bantu mengenai data Kelurahan Yosomulyo atau informasi terkini dari Google?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendMessageToGemini(input, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      timestamp: new Date(),
      groundingMetadata: response.groundingMetadata
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const renderGroundingSources = (metadata: any) => {
      if (!metadata?.groundingChunks || metadata.groundingChunks.length === 0) return null;

      return (
          <div className="mt-3 pt-3 border-t border-slate-200/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Sources</p>
              <div className="flex flex-wrap gap-2">
                  {metadata.groundingChunks.map((chunk: any, idx: number) => {
                      if (chunk.web) {
                          return (
                              <a 
                                key={idx} 
                                href={chunk.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center bg-white/50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/50 hover:border-blue-200 px-2 py-1 rounded-lg text-[10px] transition duration-200"
                              >
                                  <Globe size={10} className="mr-1.5" />
                                  <span className="truncate max-w-[150px]">{chunk.web.title || 'Web Source'}</span>
                              </a>
                          );
                      }
                      return null;
                  })}
                  
                  {metadata.searchEntryPoint && (
                       <div 
                         className="flex items-center bg-blue-50/50 text-blue-600 px-2 py-1 rounded-lg text-[10px] border border-blue-100/50"
                         dangerouslySetInnerHTML={{ __html: metadata.searchEntryPoint.renderedContent }}
                       />
                  )}
              </div>
          </div>
      );
  }

  // Use CSS class for visibility to allow exit animations if using a library, 
  // but for vanilla React conditional rendering, we'll wrap it.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:z-50 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] flex flex-col pointer-events-none">
        {/* Glass Container */}
        <div className="bg-white/80 backdrop-blur-2xl w-full h-full md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500 ease-out ring-1 ring-white/50 overflow-hidden">
          
          {/* Header */}
          <div className="p-5 pb-4 border-b border-white/20 flex justify-between items-center bg-white/30 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 ring-2 ring-white/50">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base tracking-tight">MetalOS Assistant</h3>
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span> 
                    Cognitive Engine Active
                </p>
              </div>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/50 text-slate-400 hover:text-slate-600 rounded-full transition duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white/10 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[88%] p-4 text-sm shadow-sm backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-blue-600/20'
                      : 'bg-white/80 border border-white/50 text-slate-700 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.role === 'model' && renderGroundingSources(msg.groundingMetadata)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl rounded-bl-sm border border-white/50 shadow-sm flex items-center gap-3">
                  <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white/60 border-t border-white/30 backdrop-blur-md">
            <div className="flex items-center gap-2 bg-white/70 border border-white/50 rounded-[1.5rem] px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all duration-300">
              <div className="pl-3 pr-2">
                  <Sparkles size={16} className="text-blue-400" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya tentang data desa..."
                className="bg-transparent flex-1 outline-none text-sm text-slate-800 placeholder-slate-400 py-2 min-w-0"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                    input.trim() 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:scale-105' 
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                MetalOS AI dapat membuat kesalahan. Verifikasi data penting.
            </p>
          </div>
        </div>
    </div>
  );
};

export default AiAssistant;
