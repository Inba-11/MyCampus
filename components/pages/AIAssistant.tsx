import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { GoogleGenAI, Chat } from "@google/genai";

const AIAssistant = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: Date.now(),
            sender: 'assistant',
            text: "Hello! I'm your AI Assistant. How can I help you with your studies today? You can ask me to explain concepts, summarize texts, or even draft emails.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chat = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chat.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a helpful and friendly AI assistant for students and teachers in an Indian educational institute called MyCampus. Be concise and helpful. Format your responses using markdown.',
                },
            });
        };
        initChat();
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat.current) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'me',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const assistantMessageId = Date.now() + 1;
        
        try {
            const responseStream = await chat.current.sendMessageStream({ message: input });
            
            let fullResponse = '';
            let firstChunk = true;
            for await (const chunk of responseStream) {
                if (firstChunk) {
                    setMessages(prev => [...prev, {
                        id: assistantMessageId,
                        sender: 'assistant',
                        text: '',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isLoading: true,
                    }]);
                    firstChunk = false;
                }
                fullResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: fullResponse } : msg
                ));
            }
             setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, isLoading: false } : msg
            ));
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
             setMessages(prev => [...prev, {
                id: assistantMessageId,
                sender: 'assistant',
                text: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isLoading: false,
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">AI Assistant</h2>
            </header>
            <main ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl shadow ${msg.sender === 'me' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                            {msg.isLoading ? (
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                            <span className="text-xs text-right block mt-1 opacity-75">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </main>
            <footer className="p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask the AI Assistant..." className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} />
                    <button type="submit" className="ml-3 p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                        {isLoading ? (
                             <svg className="h-6 w-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        )}
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default AIAssistant;
