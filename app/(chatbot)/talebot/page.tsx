'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import ChatInput from '@/components/TalebotChat'; // Import the new ChatInput component

export default function Chat() {
  const [messages, setMessages] = useState<{ id: number; content: string; role: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to remove citations (like [1], [2], etc.)
  const removeCitations = (text: string) => {
    return text.replace(/\[\d+\]/g, '').trim();
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage whenever the messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle submitting user input
  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: input,
      role: 'user'
    };
    setMessages(prev => [...prev, newMessage]);
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

  // Function to clear chat history
  const clearChat = () => {
    setMessages([]); // Clear state messages
    localStorage.removeItem('chatMessages'); // Remove from localStorage
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <header className="shrink-0 border-b border-gray-200 bg-white lg:hidden">
        <div className="mx-auto px-4 py-2 flex justify-between items-center">
          <a href="/" aria-label="Go back home" className="text-gray-800 dark:text-white ml-1">
            &#x2190; Home
          </a>
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
      <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-4">
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

      {/* Clear Chat Button */}
      <div className="text-center p-4">
        <button
          onClick={clearChat}
          className="px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700"
        >
          Clear Chat
        </button>
      </div>
  
      {/* ChatInput component */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
