'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { Post } from '../../lib/types';
import {handleSearch} from '../../lib/searchUtils'

// Dynamically import other components with Suspense handling
const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

const Search = () => {
  const searchParams = useSearchParams(); // Wrap this in a Suspense boundary
  const query = searchParams.get('query');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    document.title = query ? `${query} - Citale Search` : 'Citale Search';
  
    return () => {
    };
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        setLoading(true);
        const data = await handleSearch(query);
        setPosts(data || []); // Fallback to an empty array if data is null
        setError(data ? null : 'Failed to load posts'); // Set error if data is null
        setLoading(false);
        setFirstLoad(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading && firstLoad) {
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
