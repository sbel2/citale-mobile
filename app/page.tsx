"use client";
import React from 'react';
import { createClient } from "@/supabase/client";
import dynamic from 'next/dynamic';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

export default async function Home() {
  const supabase = createClient();
  
  const { data:posts, error } = await supabase
        .from("posts")
        .select()
        .order('created_at', { ascending: false })  // Order by most recent
        .order('like_count', { ascending: false });     // Order by most liked
  
  if (error) {
    return <p>Error loading posts: {error.message}</p>;
  }
  
  if (!posts || posts.length === 0) {
    return <p>No posts found</p>;
  }
  
  return (
    <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
      <div className="px-12 pb-20">
        <MasonryGrid posts={posts} />
      </div>
    </main>
  );
}
