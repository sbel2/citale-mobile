'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';

// Dynamically import other components with Suspense handling
const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });
const SearchBar = dynamic(() => import('@/components/SearchBar'), { suspense: true });

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  like_count: number;
  description?: string;
  imageURL?: string;
}

const supabase = createClient();

const SearchResult = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      document.title = `${query} - Citale Search`;
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
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonCardRow />;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <div className="px-2 pb-10 md:px-10 md:pb-20">
        {posts.length === 0 ? (
          <p className = "text-center">No posts found for &quot;{query}&quot;</p>
        ) : (
          <MasonryGrid posts={posts} />
        )}
      </div>
    </Suspense>
  );
};

export default SearchResult;
