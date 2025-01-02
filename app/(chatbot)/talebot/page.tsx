'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import ChatInput from '@/components/TalebotChat'; // Import the new ChatInput component

export default function Chat() {
  const [messages, setMessages] = useState<{ id: number; content: string; role: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const removeCitations = (text: string) => {
    return text.replace(/\[\d+\]/g, '').trim();
  };

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: input,
      role: 'user'
    };
    setMessages([...messages, newMessage]);
    setIsLoading(true);

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
      <header className="shrink-0 border-b border-gray-200 bg-white md:hidden">
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-between items-center">
          <button onClick={() => window.history.back()} aria-label="Go back home" className="text-gray-800 dark:text-white ml-1">
            &#x2190; Home
          </button>
          <Link href="/" aria-label="Home" className="inline-block mt-1">
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
      {/* Chat messages container */}
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
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-red-100 text-purple-600'
            }`}>
              {m.role === 'user' ? '👤' : '🤖'}
            </div>
            
            {/* Message content */}
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
      </div>
  
      {/* ChatInput component */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
