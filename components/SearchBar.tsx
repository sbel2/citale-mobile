"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correctly import from next/navigation

interface SearchBarProps {
  onSearch: (searchQuery: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Since the next/navigation router may not have an isReady property, you should adjust your logic to rely on other indicators if needed.
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (searchQuery.trim()) {
      router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search posts"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
