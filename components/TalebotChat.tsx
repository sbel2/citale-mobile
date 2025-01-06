'use client';

import React, { useState } from 'react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
    const target = e.currentTarget.querySelector('textarea') as HTMLTextAreaElement;
    if (target) {
      target.style.height = '44px';
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-10 pb-safe">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2">
          <textarea
            value={input}
            placeholder="Ask something..."
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              const numberOfLines = (target.value.match(/\n/g) || []).length + 1;
              const lineHeight = 35;
              const maxHeight = lineHeight * 15;
              const newHeight = Math.min(lineHeight * numberOfLines, maxHeight);
              target.style.height = `${newHeight}px`;
            }}
            className="flex-1 rounded-[24px] px-4 py-2 border border-gray-200 
              dark:border-gray-700 focus:outline-none focus:ring-2 
              focus:ring-blue-500 dark:bg-gray-800 dark:text-white 
              resize-none overflow-y-auto h-[44px] min-h-[44px] 
              max-h-[132px] transition-all duration-200"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-[80px] h-[44px] flex items-center justify-center shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
