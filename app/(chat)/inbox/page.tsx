'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/definitions'; // Ensure correct import
import { useAuth } from 'app/context/AuthContext';
import InboxPreview from '@/components/inboxPreview';

export default function Inbox() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return <div></div>; 
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <header className="fixed top-[calc(env(safe-area-inset-top)+56px)] left-0 right-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto px-4 py-2 flex justify-center relative">
          <a
            href="/"
            aria-label="Go back home"
            className="text-gray-800 dark:text-white absolute left-4"
          >
            &#x2190; Home
          </a>
          <h1 className="text-xl font-bold">Inbox</h1>
        </div>
      </header>
      <div className="mt-14">
        <InboxPreview userId={user.id} />
      </div>
    </div>
  );
}