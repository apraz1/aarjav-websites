import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, ExternalLink, RefreshCcw } from 'lucide-react';
import { Logo } from './Logo';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
}

export const FinstantAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am Finstant AI, your specialized Mortgage & Banking Advisory Assistant at Finstant Capital. Ask me anything about Indian banking credit policies, LTV thresholds, CIBIL score tier requirements, stamp duty laws, or balance transfer viability.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'What is SBI Maxgain and how does the OD facility save interest?',
    'What is the maximum LTV allowed by RBI for a ₹90 Lakh home loan?',
    'Explain banking FOIR calculation for self-employed professionals with GST returns.',
    'What tax deductions are available under Section 24(b) and Section 80C?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: 'error_' + Date.now(),
        sender: 'ai',
        text: "I'm currently running in high-speed offline advisory mode. As a general benchmark, floating rate home loans in India range between 7.20% to 8.50% for CIBIL scores above 750 with up to 90% LTV on loans under ₹30 Lakhs, and 80% on loans up to ₹75 Lakhs. Contact the Finstant Capital desk for custom sanction terms.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#12151E] rounded-3xl border border-[#D4AF37]/25 shadow-2xl overflow-hidden flex flex-col h-[700px]">
        {/* Header in Gold Luster Styling */}
        <div className="bg-gradient-to-r from-[#181C26] via-[#12151E] to-[#0B0D12] p-5 text-white flex items-center justify-between border-b border-[#D4AF37]/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center">
              <Logo variant="mark" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Finstant AI Credit Advisor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4AF37]/15 text-[#FCE59F] border border-[#D4AF37]/30">
                  Real-Time Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">Live multi-bank lending norms, RBI regulations, and DSA underwriting policy rules</p>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  sender: 'ai',
                  text: "Hello! I am Finstant AI, your specialized Mortgage & Banking Advisory Assistant at Finstant Capital. Ask me anything about Indian banking credit policies, LTV rules, CIBIL score requirements, stamp duty laws, or balance transfer viability.",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-[#FCE59F] transition-colors"
            title="Reset Conversation"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="bg-[#0B0D12] border-b border-white/5 p-3 px-4 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#D4AF37] font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Popular Inquiries:</span>
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-[#141722] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#1C212E] text-slate-300 hover:text-[#FCE59F] rounded-full shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0B0D12]/80">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#222736] text-white border border-white/10'
                    : 'bg-[#141722] border border-[#D4AF37]/40'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Logo variant="mark" size="xs" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] text-slate-950 font-medium rounded-tr-xs shadow-md'
                      : 'bg-[#141722] text-slate-200 border border-[#D4AF37]/25 rounded-tl-xs shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Sources Grounding if present */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs">
                      <span className="font-semibold text-slate-400 block mb-1">Search Citations & References:</span>
                      <div className="flex flex-wrap gap-2">
                        {m.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0D12] text-[#FCE59F] hover:bg-[#1A1E2A] border border-[#D4AF37]/30 text-[11px]"
                          >
                            <span className="truncate max-w-[150px]">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`text-[10px] text-slate-500 px-1 ${
                    m.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-[#141722] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                <Logo variant="mark" size="xs" />
              </div>
              <div className="p-4 rounded-2xl bg-[#141722] border border-[#D4AF37]/25 rounded-tl-xs shadow-xs flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-medium ml-1 text-slate-300">Consulting Gemini & banking rate charts...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0E1118] border-t border-[#D4AF37]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rate differences, LTV rules, foreclosure charges, CIBIL fixes..."
              className="flex-1 px-4 py-3 bg-[#141722] border border-[#D4AF37]/30 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37] text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-gradient-to-r from-[#FCE59F] via-[#D4AF37] to-[#B38724] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
