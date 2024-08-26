'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { PostgrestError } from '@supabase/supabase-js';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

interface Post {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
  like_count: number;
  created_at: string;
  user_id: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('post_id, title, description, imageUrl, user_id, like_count, created_at')
        .order('created_at', { ascending: false })
        .order('like_count', { ascending: false });

      if (error) {
        setError((error as PostgrestError).message);
        setLoading(false);
        return;
      }

      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

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
        <MasonryGrid posts={posts} />
      </div>
    </main>
  );
}
