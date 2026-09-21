import { useState, useEffect, useRef } from 'react';
import TopNav from '../components/layout/TopNav';
import { assistantService } from '../services/assistantService';
import type { AssistantMessage } from '../types';
import { Sparkles, Send, Bot, User as UserIcon, Lightbulb, ShieldAlert, HeartPulse } from 'lucide-react';

const suggestedPrompts = [
  {
    icon: ShieldAlert,
    label: 'Cycle Deviation Alert',
    prompt: 'Can you explain why my current cycle (Day 35) is considered a pattern change compared to my 28-day baseline?',
  },
  {
    icon: HeartPulse,
    label: 'Anemia Risk Awareness',
    prompt: 'What are the indicators of anemia risk based on my heavy flow and fatigue logs?',
  },
  {
    icon: Lightbulb,
    label: 'Sleep & Symptom Correlation',
    prompt: 'How is my recent 6.2 hours of sleep correlated with heightened cramps and mood shifts?',
  },
  {
    icon: Sparkles,
    label: 'Luteal Phase Support',
    prompt: 'What nutrition and exercise adjustments do you recommend during the late luteal phase?',
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadMessages = async () => {
    try {
      const history = await assistantService.getMessages();
      setMessages(history);
    } catch {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: "Hello! I'm your RITORA Cycle Health Intelligence Assistant. How can I help analyze your cycle, symptoms, or wellness trends today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const tempUserMsg: AssistantMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await assistantService.sendMessage(textToSend);
      setMessages((prev) => [...prev, res.assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst_err_${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting to the intelligence server right now. Please check your connection or backend server status.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav title="AI Health Assistant" subtitle="Gemini-powered contextual cycle & wellness intelligence" />

      <div className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto flex flex-col">
        {/* Suggested Prompts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {suggestedPrompts.map((s, idx) => {
            const Icon = s.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(s.prompt)}
                disabled={loading}
                className="p-3.5 rounded-2xl bg-white border border-lilac/30 hover:border-plum/40 hover:shadow-md hover:shadow-plum/5 text-left transition-all group disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-plum/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-plum" />
                </div>
                <p className="text-xs font-semibold text-charcoal mb-1">{s.label}</p>
                <p className="text-[11px] text-charcoal/50 line-clamp-2">{s.prompt}</p>
              </button>
            );
          })}
        </div>

        {/* Chat Conversation Card */}
        <div className="flex-1 bg-white rounded-3xl border border-lilac/30 p-6 flex flex-col shadow-sm min-h-[450px]">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-[500px]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl gradient-plum flex items-center justify-center shrink-0 shadow-sm shadow-plum/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? 'gradient-plum text-white rounded-tr-none shadow-md shadow-plum/10'
                        : 'bg-lilac/15 text-charcoal border border-lilac/30 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/70 text-right' : 'text-charcoal/40'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-lilac/30 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-plum" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl gradient-plum flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-lilac/15 border border-lilac/30 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-plum animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-plum animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-plum animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-charcoal/50 ml-2">RITORA is synthesizing health context...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 pt-3 border-t border-lilac/20"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your cycle deviations, fatigue patterns, lifestyle correlations..."
              className="flex-1 px-4 py-3 rounded-2xl bg-lilac/10 border border-lilac/30 text-charcoal placeholder:text-charcoal/40 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-2xl gradient-plum text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-plum/20 disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
