'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

export default function Chat() {
  const [messages, setMessages] = useState<{ id: number; content: string; role: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustTextareaHeight(event.target);
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 132)}px`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: input,
      role: 'user'
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }

    const removeCitations = (text: string) => {
      return text.replace(/\[\d+\]/g, '').trim();
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [newMessage] })
      });

      const responseData = await response.json();
      if (response.ok) {
        const cleanedText = removeCitations(responseData.generatedText);
        setMessages(prev => [...prev, { id: Date.now(), content: cleanedText, role: 'ai' }]);
      } else {
        console.error('API error:', responseData.error);
      }
    } catch (error) {
      console.error('Error submitting chat:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="shrink-0 border-b border-gray-200 bg-white dark:bg-gray-800 md:hidden">
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-between items-center">
          <button onClick={() => window.history.back()} aria-label="Go back home" className="text-gray-800 dark:text-white">
            &#x2190; Home
          </button>
          <Link href="/" aria-label="Home" className="inline-block">
            <Image
              src="/citale_header.svg"
              alt="Citale Logo"
              width={90}
              height={30}
              priority
            />
          </Link>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xl md:text-2xl text-gray-700 dark:text-gray-300">
              What do you want to explore today?
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-red-100 text-purple-600'
            }`}>
              {m.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">
                {m.role === 'user' ? 'You' : 'Citale'}
              </div>
              <div className="prose prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 max-w-3xl mx-auto">
            <div className="animate-pulse">AI is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4 pb-safe">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Ask something..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
              className="flex-1 rounded-[24px] px-4 py-2 border border-gray-200 
                dark:border-gray-700 focus:outline-none focus:ring-2 
                focus:ring-blue-500 dark:bg-gray-800 dark:text-white 
                resize-none overflow-y-auto h-[44px] min-h-[44px] 
                max-h-[132px] transition-all duration-200"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80px] h-[44px] flex items-center justify-center shrink-0"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
