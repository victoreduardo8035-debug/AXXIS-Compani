import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Sparkles, Loader2, CheckCircle2, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { createConsultancyChat } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ConsultancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWhatsApp: (summary: string) => void;
}

export const ConsultancyModal: React.FC<ConsultancyModalProps> = ({ isOpen, onClose, onWhatsApp }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !chat) {
      const newChat = createConsultancyChat();
      setChat(newChat);
      startChat(newChat);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = async (chatInstance: any) => {
    setIsLoading(true);
    try {
      const response = await chatInstance.sendMessage({ message: "Olá, gostaria de iniciar a consultoria." });
      setMessages([{ role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Error starting chat:", error);
      setMessages([{ role: 'model', text: "Desculpe, tive um problema ao iniciar a consultoria. Por favor, tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Houve um erro na comunicação. Por favor, tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const summary = messages
      .map(m => `${m.role === 'user' ? 'Cliente' : 'Consultor'}: ${m.text}`)
      .join('\n\n');
    onWhatsApp(summary);
  };

  const getProgress = () => {
    const count = messages.length;
    if (count <= 1) return 25;
    if (count <= 3) return 50;
    if (count <= 5) return 75;
    return 100;
  };

  const isEvaluationReached = messages.length >= 7;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl h-[85vh] bg-brand-dark border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent border border-brand-accent/20">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl tracking-tight">Diagnóstico Estratégico</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-brand-cream/40 uppercase tracking-[0.2em] font-black">Consultor IA Ativo</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:rotate-90">
                <X size={24} />
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                  className="h-full bg-brand-accent shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[90%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-6 rounded-[28px] text-sm leading-relaxed shadow-lg",
                    msg.role === 'user' 
                      ? "bg-brand-accent text-brand-dark font-bold rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-brand-cream/90 rounded-tl-none prose prose-invert prose-sm max-w-none"
                  )}>
                    {msg.role === 'model' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-black text-brand-cream/20 mt-2 px-2">
                    {msg.role === 'user' ? 'Você' : 'AXXIS AI'}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] px-2">
                  <Loader2 size={16} className="animate-spin" /> Analisando dados...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 space-y-6 bg-white/2">
              {isEvaluationReached && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-accent" size={20} />
                    <p className="text-xs font-bold text-brand-accent uppercase tracking-tight">Diagnóstico Concluído!</p>
                  </div>
                  <button 
                    onClick={handleWhatsApp}
                    className="btn-primary py-2 px-6 text-[10px] uppercase tracking-widest"
                  >
                    Falar com Humano
                  </button>
                </motion.div>
              )}

              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLoading ? "Aguarde..." : "Sua resposta estratégica..."}
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-accent/50 transition-all placeholder:text-brand-cream/20"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-14 h-14 rounded-2xl bg-brand-accent text-brand-dark flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-accent/20"
                >
                  <Send size={24} />
                </button>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border border-brand-dark bg-brand-accent/20 flex items-center justify-center">
                        <Users size={10} className="text-brand-accent" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-brand-cream/30 uppercase tracking-[0.2em] font-black">
                    Consultoria Estratégica Digital
                  </p>
                </div>
                {!isEvaluationReached && (
                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest hover:underline opacity-50 hover:opacity-100 transition-all"
                  >
                    <MessageCircle size={14} /> Pular para WhatsApp
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
