'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import dynamic from 'next/dynamic';
import SkeletonCardRow from '@/components/SkeletonPost';
import { PostgrestError } from '@supabase/supabase-js';
import { Post } from '../lib/types';
import styles from '@/components/page.module.css';
import {useAuth} from 'app/context/AuthContext';

const MasonryGrid = dynamic(() => import('@/components/MasonryGrid'), { ssr: false });

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      try {
        // Get list of users who blocked the current user
        let blockedByUsers: string[] = [];
        let blockedUsers: string[] = [];
        if (user?.id) {
          const { data: blockers } = await supabase
            .from('blocks')
            .select('user_id')
            .eq('blocked_id', user.id);
          
          blockedByUsers = blockers?.map(b => b.user_id) || [];

          const { data: blocked } = await supabase
          .from('blocks')
          .select('blocked_id')
          .eq('user_id', user.id);
        
        blockedUsers = blocked?.map(b => b.blocked_id) || [];
      }

        // Build main query
        let query = supabase
          .from('posts')
          .select('*')
          .or('endDate.is.null,endDate.gte.' + new Date().toISOString().split('T')[0])
          .order('created_at', { ascending: false });

        // Add block filter if user is logged in
        if (user?.id && blockedByUsers.length > 0) {
          query = query.not('user_id', 'in', `(${blockedByUsers.join(',')})`);
        }
        
        if (blockedUsers.length > 0) {
          query = query.not('user_id', 'in', `(${blockedUsers.join(',')})`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setError((err as PostgrestError).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]); // Re-fetch when user changes


  if (loading) {
    return (
      <main className="min-h-screen mx-auto max-w-[100rem] overflow-x-hidden">
        <div className={styles.container}>
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
      <div className={styles.container}>
          <MasonryGrid posts={posts}/>
      </div>
      {/* block to for mobile toolbar to appear full */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-white p-4 shadow-md z-10 md:hidden"></div>
    </main>
  );
}
