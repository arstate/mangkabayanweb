
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SmartImage } from './ui/SmartImage';

const SYSTEM_INSTRUCTION = `
Anda adalah "Mang Asisten", asisten virtual AI untuk Restoran Mangkabayan Surabaya.
Jawablah dengan SINGKAT, PADAT, dan JELAS.
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sampurasun! Ada yang bisa Mang Asisten bantu untuk reservasi atau info menu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      const result = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Mohon maaf sedang gangguan sinyal.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="pointer-events-auto w-[90vw] md:w-[380px] h-[500px] flex flex-col rounded-[32px] overflow-hidden border border-white/40 shadow-2xl backdrop-blur-2xl bg-white/60"
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-mangka-primary/10 to-mangka-secondary/10 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-white/50">
                   <SmartImage 
                      src="https://lh3.googleusercontent.com/pw/AP1GczOBZrDaNNLefC1q0tty73jfvBxgFbqteaw0PP6KZJwGPb1MNPGLKihXG1yxkxWoKPeIBLcKJ-kWcLXaa0T73Vfrl0y2ZjonMdpCLNPPbOiNLVdpkgg=w2400" 
                      alt="Logo Mangkabayan"
                      className="w-full h-full object-cover"
                   />
                </div>
                <h3 className="font-serif font-bold text-mangka-primary">Mang Asisten</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-mangka-primary/70"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-mangka-primary text-white' : 'bg-white/80 text-mangka-primary border border-white/50'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/40 border-t border-white/30">
              <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2 border border-white/50">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanya..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <button onClick={handleSend} className="p-2 bg-mangka-secondary text-white rounded-full"><Send size={16} /></button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center justify-center w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl text-mangka-primary"
          >
            <div className="bg-mangka-secondary w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
               <MessageCircle className="text-white w-6 h-6" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
