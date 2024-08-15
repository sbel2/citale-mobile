"use client";

import Link from "next/link";
import Image from "next/legacy/image";
import SearchBar from '@/components/SearchBar';
import React, { useState } from 'react';
import { createClient } from "@/supabase/client";

interface Post {
  id: number;
  title: string;
  description: string;
}

export default function Header({ font }: { font?: string }) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const supabase = createClient();

  const handleSearch = async (query: string) => {
    console.log("Searching for:", query);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) {
        console.error('Error fetching posts:', error);
        alert("Failed to fetch search results."); // User feedback
      } else {
        setSearchResults(data || []); // Ensure searchResults is never null
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={`py-2 md:py-7 pt-7 md:pt-10 bg-gray-0 ${font}`}>
      <div className="max-w-[100rem] px-5 md:px-10 mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a aria-label="Home">
            <Image
              src="/citale_header.svg"
              alt="Citale Logo"
              width={110}
              height={40}
              priority
            />
          </a>
        </Link>
        <SearchBar onSearch={handleSearch} />
        <a
          href="https://forms.gle/fr4anWBWRkeCEgSN6"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm md:text-base"
        >
          How do you like Citale?
        </a>
      </div>
    </header>
  );
}
