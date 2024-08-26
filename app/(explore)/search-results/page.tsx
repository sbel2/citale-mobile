'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';

// Dynamically import other components with Suspense handling
const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

interface Post {
  post_id: number;
  title: string;
  created_at: string;
  like_count: number;
  description?: string;
  imageUrl?: string;
  user_id: number;
}

const supabase = createClient();

const Search = () => {
  const searchParams = useSearchParams(); // Wrap this in a Suspense boundary
  const query = searchParams.get('query');

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        .select('post_id, title, description, imageUrl, user_id, like_count, created_at')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .order('like_count', { ascending: false });

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
    return (
      <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
        <div className="px-2 pb-8 pt-10 md:px-10 md:pb-20">
          <SkeletonCardRow />
        </div>
      </main>
    );
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
      <div className="px-2 pb-8 pt-10 md:px-10 md:pb-20">
      {posts.length === 0 ? (
        <p className="text-center">No posts found :) </p>
      ) : (
        <MasonryGrid posts={posts} />
      )}
    </div>
    </main>
  );
};

const SearchResult = () => {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <Search />
    </Suspense>
  );
};

export default SearchResult;
