'use client'; // Mark this component as a client component

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  like_count: number;
  // Add any other fields your posts have
}

export default function Home() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .order('like_count', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // Initial fetch of posts
    fetchPosts();

    // Set up real-time subscription
    const channel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload: any) => {
        console.log('Change detected:', payload);
        fetchPosts();
      })
      .subscribe();

    // Cleanup function to unsubscribe from the channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
        <div className="px-2 pb-10 md:px-10 md:pb-20">
          <SkeletonCardRow />
        </div>
      </main>
    );
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts found</p>;
  }

  return (
    <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
      <div className="px-2 pb-10 md:px-10 md:pb-20">
        <MasonryGrid posts={posts} />
      </div>
    </main>
  );
}
