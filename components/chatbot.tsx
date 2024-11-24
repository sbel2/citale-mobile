"use client";

import { useChat, Message } from "ai/react";

export const Chat = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: Message[];
}) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } =
    useChat({
      api: "/api/chat-stream",
      body: { sessionId },
      initialMessages,
    });

  return (
    <div>
      <div className="flex h-[calc(100vh-64px)] flex-col overflow-y-auto items-center">
        {messages.length ? (
          messages.map((message, i) => (
            <div className="w-[60vw] flex flex-row gap-3 p-6" key={i}>
              <div className="min-w-12">
                {message.role === "user" ? "User" : "Bot"}
              </div>
              <p className="text-sm font-normal text-gray-900">
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-zinc-500 text-sm pt-6">
            Ask your first question to get started.
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-row gap-2 p-3 h-16 items-center">
          <input
            onChange={handleInputChange}
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
                setInput("");
              }
            }}
            placeholder="Enter your question..."
            className="border rounded-xl w-full py-1 px-3"
          />

          <button type="submit" className="border rounded-xl py-1 px-3">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
