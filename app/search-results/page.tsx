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
      <main className="px-2 pb-10 md:px-10 md:pb-20">
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
    <div className="px-2 pb-10 md:px-10 md:pb-20">
      <h1 className="text-xl md:text-3xl font-bold mb-4 text-center">Search Results for "{query}"</h1>
      <MasonryGrid posts={posts} />
    </div>
  );
};

export default SearchResult;
