'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct hook for getting query params
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import SearchBar from '@/components/SearchBar';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  like_count: number;
  description?: string;  // Assuming you may have description
  imageURL?: string;     // Assuming you may have imageURL
}

const supabase = createClient();

const SearchResult = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams(); // Hook to access query parameters
  const query = searchParams.get('query'); // Get the 'query' parameter from the URL

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

      if (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
        <SkeletonCardRow />
      </main>
    );
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts found for "{query}"</p>;
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Search Results for "{query}"</h1>
      <SearchBar onSearch={handleSearch} />
      <MasonryGrid posts={posts} />
    </div>
  );
};

export default SearchResult;
