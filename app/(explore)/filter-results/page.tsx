'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { Post } from '../../lib/types';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

const supabase = createClient();

const Filter = () => {
  const filterParams = useSearchParams(); // Wrap this in a Suspense boundary
  const selectedOption = filterParams.get('option') || 'all';

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedOption) {
      document.title = `${selectedOption} - Citale Search`;
      handleFilter(selectedOption);
    }
  }, [selectedOption]);

  const handleFilter = async (option: string) => {
    setLoading(true);
    try {
      if (option === 'all') {
        const { data, error } = await supabase
          .from('posts')
          .select('*');
        if (error) {
          console.error('Error fetching posts:', error);
          setError('Failed to load posts');
        } else {
          setPosts(data || []);
        }
      } else {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('category', option);
        if (error) {
          console.error('Error fetching posts:', error);
          setError('Failed to load posts');
        } else {
          setPosts(data || []);
        }
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
    return <p>Error loading filter posts: {error}</p>;
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

const FilterResult = () => {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <Filter />
    </Suspense>
  );
};

export default FilterResult;