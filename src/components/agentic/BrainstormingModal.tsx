import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  Zap, 
  Shield, 
  BrainCircuit,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const BrainstormingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to the Architecture Chamber. I am your Sanctuary Architect. Shall we begin designing your digital aura?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // API call to the new agentic endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/agentic/brainstorm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMessage, session_id: sessionId })
      });

      const data = await response.json();
      setSessionId(data.session_id);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error("Brainstorming failure:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "The connection to the neural grid was interrupted. Let us try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl h-[80vh] bg-mat-obsidian border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-mat-gold/20 flex items-center justify-center border border-mat-gold/30">
                  <BrainCircuit className="text-mat-gold" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-black text-white italic tracking-tight uppercase">Sanctuary Architect</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-6 py-4 rounded-[2rem]",
                    m.role === 'user' ? "bg-mat-gold text-mat-obsidian font-bold" : "bg-white/5 text-white/80 border border-white/5"
                  )}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                  <span className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-2 px-2">
                    {m.role === 'user' ? 'Aspirant' : 'Architect'}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-mat-gold/60">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Architect is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white/5 border-t border-white/5">
              <div className="flex gap-4 items-center">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Share your vision..."
                  className="h-16 flex-1 bg-black/40 border-white/10 rounded-2xl text-white px-6 focus:ring-mat-gold/20"
                />
                <Button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-16 h-16 rounded-2xl bg-mat-gold text-mat-obsidian hover:scale-105 transition-transform"
                >
                  <Send size={24} />
                </Button>
              </div>
              <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] text-center mt-6">
                Powered by Superpowers Brainstorming Protocol v1.2
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
