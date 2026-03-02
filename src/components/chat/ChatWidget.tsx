'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, ExternalLink } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMsg {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Send greeting on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Olá! 👋 Bem-vindo(a) à **Planejados Por Você**! Eu sou o assistente virtual e posso te ajudar agora.\n\nO que você precisa?\n\n1️⃣ **Móveis Planejados** sob medida\n2️⃣ **Assistência Técnica** (reparos, ajustes, ferragens)\n3️⃣ **Falar no WhatsApp** agora (mais rápido)'
            }]);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: ChatMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    conversationId,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await res.json();

            if (data.conversationId) {
                setConversationId(data.conversationId);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Desculpe, tive um problema técnico. Que tal falar diretamente no WhatsApp? Lá consigo te ajudar melhor! 😊',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const renderContent = (text: string) => {
        // Simple markdown bold
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            // Handle newlines
            return part.split('\n').map((line, j) => (
                <span key={`${i}-${j}`}>
                    {j > 0 && <br />}
                    {line}
                </span>
            ));
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-24 z-40 w-14 h-14 bg-gradient-to-br from-wood-600 to-wood-800 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                        aria-label="Abrir chat"
                    >
                        <MessageSquare size={26} className="text-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-wood-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-wood-700 to-wood-800 text-white p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-heading font-semibold text-sm">Assistente Virtual</h3>
                                    <p className="text-xs text-wood-200">Planejados Por Você</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Fechar chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-wood-50/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-wood-600 to-wood-700 text-white rounded-br-md'
                                                : 'bg-white text-dark-700 shadow-sm border border-wood-100 rounded-bl-md'
                                            }`}
                                    >
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="chat-bubble flex justify-start">
                                    <div className="bg-white text-dark-400 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-wood-100">
                                        <Loader2 size={18} className="animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp shortcut */}
                        <div className="px-4 py-2 bg-accent-50 border-t border-accent-100 shrink-0">
                            <a
                                href={generateWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-accent-700 text-xs font-medium hover:text-accent-800 transition-colors"
                            >
                                <ExternalLink size={12} />
                                Prefere falar direto no WhatsApp? Clique aqui
                            </a>
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-wood-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm text-dark-700 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-wood-400 focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="w-10 h-10 bg-gradient-to-r from-wood-600 to-wood-700 text-white rounded-xl flex items-center justify-center hover:from-wood-700 hover:to-wood-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Enviar"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
