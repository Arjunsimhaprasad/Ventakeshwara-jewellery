import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldCheck } from 'lucide-react';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! I am Ratna, your luxury jewellery advisor at Venkateshwara Jewellery. Whether you are looking for heritage 22K gold, solitaire diamonds, or ring size guidance, how may I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: data.text }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Our concierge advisor is currently busy. Please feel free to explore our collections or reach out via Support.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Thank you for your inquiry. Venkateshwara Jewellery offers certified 22K hallmarked gold and VVS solitaire diamonds.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    'Recommend a 22K gold temple necklace',
    'What is the difference between 22K and 18K gold?',
    'Show solitaire diamond rings under ₹3,000,000',
    'Help me choose a bridal Polki Kundan set'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0D131F] border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] relative">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-burgundy-950 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-100 flex items-center gap-2">
                Ratna <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded-full border border-gold-500/30">AI Jewellery Concierge</span>
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Google Gemini Backend Service • Certified Store Advisor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gold-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-gold-400 text-xs font-medium">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Ratna is curating recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-5 py-2 border-t border-slate-800/80 bg-slate-900/50 flex gap-2 overflow-x-auto no-scrollbar">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 border border-slate-700 hover:border-gold-500/50 px-3 py-1 rounded-full transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-800 glass-panel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Ratna about designs, gold purity, prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-gold-glow flex items-center justify-center transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
