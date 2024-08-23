'use client';

import { useEffect, useState } from 'react';
import PostComponent from "@/components/postComponent";
import { createClient } from "@/supabase/client";
import { notFound, useRouter } from "next/navigation";

interface Post {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
  like_count: number;
  created_at: string;
  user_id: number;
}

const supabase = createClient();

export default function Page({ params }: { params: { id: string } }) {
  const { id: post_id } = params;
  const [postData, setPostData] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPostData = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("post_id, title, description, imageUrl, user_id, like_count, created_at")
        .eq("post_id", post_id)
        .single();

      if (error || !data) {
        console.error('Error fetching post data:', error);
        notFound();
      } else {
        console.log('Fetched post data:', data);
        setPostData(data as Post);
      }
    };

    fetchPostData();
  }, [post_id]);

  // Set the document title based on the post title
  useEffect(() => {
    if (postData?.title) {
      document.title = postData.title;  // This changes the browser tab title
    }
  }, [postData]);

  if (!postData) {
    return null;  // Optionally, you can show a loading spinner here
  }

  return (
    <div className="post-container md:w-[750px] md:h-[600px] lg:w-[850px] lg:h-[678px] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
      <PostComponent post = {postData} context = "static"/>
      <style jsx>{`
        .post-container {
          position: absolute;
          border:0.5px solid #d1d5db;
          margin-top: 20px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .post-container {
            top:50px;
            right: 0;
            bottom: 0;
            left: 0;
          }
        }
      `}</style>
      </div>
  );
}
