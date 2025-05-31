"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { askQuestion } from '../services/api';
import TypewriterEffect from './TypewriterEffect';
import ReactMarkdown from 'react-markdown';
import { useTheme } from "next-themes";
import { saveAs } from 'file-saver';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    id: string;
    isTyping?: boolean;
    timestamp?: string;
}

export default function PdfChat({ pdfName }: { pdfName: string }) {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputFocused, setInputFocused] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) return;

        const messageId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMessage: ChatMessage = {
            role: 'user',
            content: question,
            id: messageId,
            timestamp
        };

        console.log("Adding user message:", userMessage);
        setMessages(prev => [...prev, userMessage]);

        const currentQuestion = question;
        setQuestion('');

        setIsLoading(true);
        const loadingToast = toast.loading('AI is processing your question...', {
            position: 'bottom-right',
            className: 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white'
        });

        try {
            const result = await askQuestion(currentQuestion, pdfName);

            const assistantMessageId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: result.answer,
                id: assistantMessageId,
                isTyping: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            console.log("Adding assistant message:", assistantMessage);
            setMessages(prev => [...prev, assistantMessage]);

            toast.dismiss(loadingToast);
            toast.success('Answer ready!', {
                position: 'bottom-right',
                className: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
            });
        } catch (error) {
            console.error('Error getting answer:', error);
            toast.dismiss(loadingToast);
            toast.error('Failed to process question', {
                position: 'bottom-right',
                className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
            });

            // Add error message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I couldn't process your question. Please try again.",
                id: Date.now().toString(),
                isTyping: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypingComplete = (messageId: string) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId ? { ...msg, isTyping: false } : msg
            )
        );
    };

    const handleSuggestedQuestion = (q: string) => {
        setQuestion(q);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const copyMessageToClipboard = (content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => {
                toast.success('Copied to clipboard!', {
                    position: 'bottom-right',
                    autoClose: 2000,
                    className: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                });
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy text', {
                    position: 'bottom-right',
                    className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                });
            });
    };

    const exportChat = async () => {
        setIsExporting(true);
        try {
            const filename = `chat-${pdfName.split('.')[0]}-${new Date().toISOString().slice(0, 10)}.txt`;

            const content = [
                `# Chat with PDF: ${pdfName}`,
                `# Exported on: ${new Date().toLocaleString()}`,
                `\n`,
                ...messages.map(msg =>
                    `[${msg.timestamp}] ${msg.role === 'user' ? 'You' : 'AI Assistant'}:\n${msg.content}\n`
                )
            ].join('\n\n');

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

            setTimeout(() => {
                saveAs(blob, filename);

                setTimeout(() => {
                    toast.success('Chat conversation exported!', {
                        position: 'bottom-right',
                        className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    });
                    setIsExporting(false);
                }, 500);
            }, 100);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export chat', {
                position: 'bottom-right',
                className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
            });
            setIsExporting(false);
        }
    };

    const suggestedQuestions = [
        "What is the main topic of this document?",
        "Can you summarize this PDF in bullet points?",
        "What are the key findings in this document?",
        "Extract the most important statistics from this PDF"
    ];

    return (
        <motion.div
            className="flex flex-col h-[600px] rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4 backdrop-blur-sm border-b border-white/10 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{
                        background: [
                            'linear-gradient(120deg, rgba(59, 130, 246, 0.05) 0%, rgba(79, 70, 229, 0.1) 100%)',
                            'linear-gradient(120deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-4 shadow-lg"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Animated PDF icon */}
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </motion.svg>
                        </motion.div>

                        <div>
                            <motion.h2
                                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                Chat with PDF
                            </motion.h2>
                            <div className="flex items-center">
                                <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full mr-2"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: "mirror"
                                    }}
                                />
                                <motion.p
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="font-medium">{pdfName}</span>
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {messages.length > 0 && (
                        <motion.button
                            onClick={() => exportChat()}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isExporting}
                            aria-label="Export chat"
                        >
                            {isExporting ? (
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                </motion.svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-indigo-600 dark:scrollbar-track-gray-800"
                ref={chatContainerRef}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme === 'dark' ? '#4f46e5 #1f2937' : '#3b82f6 #f3f4f6'
                }}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    </div>
                ) : (
                    <div className="space-y-5">
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                layout
                            >
                                {message.role === 'assistant' && (
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white mr-3 shadow-lg"
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                    >
                                        {/* Enhanced Robot Avatar */}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="24" height="24" rx="12" fill="url(#robotGradient)" fillOpacity="0.3" />
                                            <motion.path
                                                d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1, delay: 0.1 }}
                                            />
                                            <motion.rect
                                                x="10"
                                                y="14"
                                                width="4"
                                                height="4"
                                                rx="1"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                transition={{ duration: 0.3, delay: 0.8 }}
                                            />
                                            <motion.circle
                                                cx="9"
                                                cy="9.5"
                                                r="1"
                                                fill="currentColor"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", delay: 0.3 }}
                                            />
                                            <motion.circle
                                                cx="15"
                                                cy="9.5"
                                                r="1"
                                                fill="currentColor"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", delay: 0.5 }}
                                            />
                                            <motion.path
                                                d="M6 11.5h2"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.7 }}
                                            />
                                            <motion.path
                                                d="M16 11.5h2"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.7 }}
                                            />
                                            <defs>
                                                <linearGradient id="robotGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#4338CA" />
                                                    <stop offset="1" stopColor="#3B82F6" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </motion.div>
                                )}
                                <motion.div
                                    className={`p-5 rounded-2xl max-w-[85%] relative overflow-hidden group ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white ml-auto'
                                            : 'backdrop-blur-sm bg-white/10 dark:bg-gray-900/30 border border-white/10 dark:border-gray-700/30 mr-auto'
                                        }`}
                                    style={{
                                        boxShadow: message.role === 'user'
                                            ? '0 8px 20px rgba(37, 99, 235, 0.3)'
                                            : '0 8px 32px rgba(31, 38, 135, 0.15)'
                                    }}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className={`absolute top-2 ${message.role === 'user' ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <motion.button
                                            onClick={() => copyMessageToClipboard(message.content)}
                                            className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </motion.button>
                                    </div>

                                    {message.role === 'assistant' && (
                                        <motion.div
                                            className="absolute inset-0 -z-10"
                                            initial={{ x: -100, opacity: 0.2 }}
                                            animate={{ x: 200, opacity: 0.5 }}
                                            transition={{
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 2,
                                                ease: "easeInOut",
                                                repeatDelay: 1
                                            }}
                                            style={{
                                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                                            }}
                                        />
                                    )}

                                    <div className="space-y-2 group">
                                        {message.role === 'assistant' ? (
                                            message.isTyping ? (
                                                <div className="prose dark:prose-invert prose-sm max-w-none">
                                                    <TypewriterEffect
                                                        text={message.content}
                                                        speed={8} // Slightly faster typing
                                                        onComplete={() => handleTypingComplete(message.id)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="prose dark:prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                </div>
                                            )
                                        ) : (
                                            <p>{message.content}</p>
                                        )}

                                        <div className={`text-xs opacity-70 ${message.role === 'user' ? 'text-left' : 'text-right'} flex items-center ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                                            <motion.button
                                                onClick={() => copyMessageToClipboard(message.content)}
                                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Copy to clipboard"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>

                                {message.role === 'user' && (
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white ml-3 shadow-lg"
                                        initial={{ scale: 0, rotate: 20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        whileHover={{ rotate: [0, 5, -5, 0], scale: 1.1 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <motion.div
                        className="py-8 flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.7, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "mirror"
                                }}
                            />

                            <div className="w-20 h-20 relative">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent ${i === 0 ? 'border-t-blue-500' :
                                            i === 1 ? 'border-r-violet-500' :
                                                'border-b-fuchsia-500'
                                            }`}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1.5 - (i * 0.2),
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        style={{ opacity: 1 - (i * 0.2) }}
                                    />
                                ))}

                                {/* Pulsing center dot */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        repeatType: "mirror"
                                    }}
                                />
                            </div>

                            <motion.div
                                className="mt-6 text-center font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Analyzing document...
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="border-t border-white/10 p-4 backdrop-blur-sm relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{
                        background: [
                            'linear-gradient(120deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                            'linear-gradient(120deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
                />

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <motion.div
                        className="relative mt-4 w-full flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Ask a question about your PDF..."
                                className="w-full px-6 py-4 pr-12 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />

                            <motion.div
                                className="absolute -inset-[2px] rounded-full -z-10"
                                animate={{
                                    opacity: inputFocused ? [0.3, 0.6, 0.3] : 0,
                                    boxShadow: inputFocused ?
                                        ['0 0 0 3px rgba(59, 130, 246, 0)', '0 0 0 4px rgba(59, 130, 246, 0.3)', '0 0 0 3px rgba(59, 130, 246, 0)'] :
                                        '0 0 0 0 rgba(59, 130, 246, 0)'
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: inputFocused ? Infinity : 0,
                                    repeatType: "loop"
                                }}
                            />

                            <motion.div
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </motion.div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={!question.trim() || isLoading}
                            className={`px-6 py-4 rounded-full text-white shadow-lg ${question.trim() && !isLoading
                                ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700'
                                : 'bg-gradient-to-r from-gray-400/80 to-gray-500/80 dark:from-gray-700/80 dark:to-gray-800/80 cursor-not-allowed'
                                }`}
                            whileHover={question.trim() && !isLoading ? { scale: 1.05, y: -2 } : {}}
                            whileTap={question.trim() && !isLoading ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                boxShadow: question.trim() && !isLoading
                                    ? '0 8px 20px rgba(37, 99, 235, 0.3)'
                                    : 'none'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    animate={isLoading ? { rotate: 360 } : {}}
                                    transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                                >
                                    {isLoading ? (
                                        <circle cx="12" cy="12" r="10" />
                                    ) : (
                                        <>
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </>
                                    )}
                                </motion.svg>
                                <span>{isLoading ? "Processing..." : "Ask"}</span>
                            </div>
                        </motion.button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
}