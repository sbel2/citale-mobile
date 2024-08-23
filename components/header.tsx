"use client";

import Link from "next/link";
import Image from "next/legacy/image";
import SearchBar from '@/components/SearchBar';
import React, { useState } from 'react';
import { createClient } from "@/supabase/client";
import { usePathname } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  description: string;
}

export default function Header({ font }: { font?: string }) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const supabase = createClient();
  const pathname = usePathname(); 

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

  // Use `router.asPath` to determine the current path
  if (pathname.startsWith('/post/')) {
    // Custom header for the post page
    return (
      <header className={`py-1 md:py-3 pt-4 md:pt-6 bg-gray-0 ${font}`}>
        <div className="max-w-[100rem] px-3 md:px-6 mx-auto flex items-center relative">
          <Link href="/" className="pl-1 md:pl-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <Image
              src="/return.svg"
              alt="Return to Home"
              width={30}
              height={30}
            />
          </Link>
          <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">Post</h1>
        </div>
      </header>

    );
  }

  // Default header
  return (
    <header className={`py-1 md:py-3 pt-4 md:pt-6 bg-gray-0 ${font}`}>
      <div className="max-w-[100rem] px-3 md:px-6 mx-auto flex items-center">
        <Link href="/" aria-label="Home">
          <Image
            src="/citale_header.svg"
            alt="Citale Logo"
            width={110}  // Reduced width
            height={40} // Reduced height
            priority
          />
        </Link>
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-sm p-1 sm:p-2"> {/* Adjusted padding */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <a
          href="https://forms.gle/fr4anWBWRkeCEgSN6"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block ml-3 text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-sm md:text-base"
        >
          How do you like Citale?
        </a>
      </div>
    </header>
  );
}
