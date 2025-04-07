'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { Post } from '../../lib/types';
import {handleFilter} from '../../lib/filterUtils'
import styles from '@/components/page.module.css'
import {useAuth} from 'app/context/AuthContext';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

const Filter = () => {
  const searchParams = useSearchParams(); 
  const selectedOption = searchParams.get('option') || 'All';
  const selectedLocation = searchParams.get('location') || 'All';
  const selectedPrice = searchParams.get('price') || 'All';
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    document.title = selectedOption ? `${selectedOption} - Citale` : 'Citale';
  
    return () => {
    };
  }, [selectedOption, selectedLocation, selectedPrice]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedOption || selectedLocation || selectedPrice) {
        setLoading(true);
        const data = await handleFilter(selectedOption, selectedLocation, selectedPrice, user?.id);
        setPosts(data || []); // Fallback to an empty array if data is null
        setError(data ? null : 'Failed to load posts'); // Set error if data is null
        setLoading(false);
        setFirstLoad(false);
      }
    };

    fetchData();
  }, [selectedOption, selectedLocation, selectedPrice]);

  if (loading && firstLoad) {
    return (
      <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
        <div className={styles.container}>
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
      <div className={styles.container}>
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
    <Suspense fallback={<div></div>}>
      <Filter />
    </Suspense>
  );
};

export default FilterResult;