'use client';

import { useEffect, useState } from 'react';
import PostComponent from "@/components/postComponent";
import { createClient } from "@/supabase/client";
import { Post } from '../../../lib/types';

export default function Page({ params }: { params: { id: string } }) {
  const { id: post_id } = params;
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchPostData = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("post_id, title, description, is_video, mediaUrl, mapUrl, thumbnailUrl, user_id, like_count, created_at")
        .eq("post_id", post_id)
        .single();

      if (error || !data) {
        console.error('Error fetching post data:', error);
        setPostData(null);
        setloading(false);
        return;
      } else {
        setPostData(data);
        document.title = data.title;
        setloading(false);
      }
    };

    fetchPostData();
  }, [post_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-grey-500"></div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">No post found :(</p>
      </div>
    );
  }

  const fetchUserProfile = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();
    if(data){
      postData.username = data.username;
      postData.avatar_url = data.avatar_url;
    }
  };

  return (
    <div className="post-container md:w-[750px] md:h-[600px] lg:w-[850px] lg:h-[678px] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
      <PostComponent post={postData} context="static" />
      <style jsx>{`
        .post-container {
          position: absolute;
          border: 0.5px solid #d1d5db;
        }

        @media (max-width: 768px) {
          .post-container {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}
