'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { Post } from '../../lib/types';
import {handleFilter} from '../../lib/filterUtils'

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

const supabase = createClient();

const Filter = () => {
  const searchParams = useSearchParams(); 
  const selectedOption = searchParams.get('option') || 'all';
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = selectedOption ? `${selectedOption} - Citale Search` : 'Citale Search';
  
    return () => {
    };
  }, [selectedOption]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedOption) {
        setLoading(true);
        const data = await handleFilter(selectedOption);
        setPosts(data || []); // Fallback to an empty array if data is null
        setError(data ? null : 'Failed to load posts'); // Set error if data is null
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]);

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