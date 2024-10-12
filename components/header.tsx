"use client";

import Link from "next/link";
import Image from "next/legacy/image";
import SearchBar from '@/components/SearchBar';
import FilterButton from '@/components/Filter';
import React, { useState } from 'react';
import { createClient } from "@/supabase/client";
import { useRouter } from 'next/navigation';

export default function Header({ font }: { font?: string }) {
  const [filterOption, setFilterOption] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  
  const router = useRouter();

  const searchRoute = async (searchQuery: string) => {
    // Redirect to search results page with the query in URL
    router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleFilter = async (option: string) => {
    setFilterOption(option);
    console.log(`Selected filter: ${option}`);
    setLoading(true);
    try {
      if(option === 'all'){
        const { data, error } = await supabase
        .from('posts')
        .select('*');
        if (error) {
          console.error('Error fetching posts:', error);
          alert("Failed to fetch search results."); // User feedback
        } else {
          setFilterOption(option ||'all'); // Ensure searchResults is never null
        }
      }
      else{
        const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', option);
        if (error) {
          console.error('Error fetching posts:', error);
          alert("Failed to fetch search results."); // User feedback
        } else {
          setFilterOption(option ||'all'); // Ensure searchResults is never null
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={`py-1 md:py-3 pt-4 md:pt-6 bg-gray-0 ${font}`}>
      <div className="max-w-[100rem] px-3 md:px-6 mx-auto flex items-center">
        <Link href="/" aria-label="Home" className = "pt-1.5">
          <Image
            src="/citale_header.svg"
            alt="Citale Logo"
            width={105}  // Reduced width
            height={35} // Reduced height
            priority
          />
        </Link>
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-sm p-1 sm:p-2"> {/* Adjusted padding */}
            <SearchBar onSearch={searchRoute}/>
          </div>
          
        </div>
        <a
          href="https://forms.gle/fr4anWBWRkeCEgSN6"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block ml-3 text-blue-600 underline hover:text-blue-800 transition-colors duration-200 text-base"
        >
          How do you like Citale?
        </a>
      </div>
      
      <div className="w-55 max-w-xs p-1 sm:p-2" style={{margin: '0 auto'}}>
        <FilterButton onFilter={handleFilter} />
      </div>
      
    </header>
  );
}
