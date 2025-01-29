// hooks/useLikes.ts

import { supabase } from "@/app/lib/definitions";
import { useState, useEffect } from "react";

interface UseLikeProps {
    postId: number;
    userId?: string;
    initialLikeCount: number;
  }
  
  export const useLike = ({ postId, userId, initialLikeCount }: UseLikeProps) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikeCount);
  
    const updatePostLikeCount = async (count: number) => {
      const { error } = await supabase
        .from('posts')
        .update({ like_count: count })
        .eq('post_id', postId);
      
      if (error) throw new Error(`Failed to update post like count: ${error.message}`);
    };
  
    const addLike = async () => {
      if (!userId) return;
  
      const { error } = await supabase
        .from('likes')
        .insert([{ user_id: userId, post_id: postId }]);
      
      if (error) throw new Error(`Failed to add like: ${error.message}`);
      
      await updatePostLikeCount(likesCount + 1);
      setLikesCount(prev => prev + 1);
      setLiked(true);
    };
  
    const removeLike = async () => {
      if (!userId) return;
  
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: userId, post_id: postId });
      
      if (error) throw new Error(`Failed to remove like: ${error.message}`);
      
      await updatePostLikeCount(likesCount - 1);
      setLikesCount(prev => prev - 1);
      setLiked(false);
    };
  
    const toggleLike = async () => {
      try {
        if (liked) {
          await removeLike();
        } else {
          await addLike();
        }
      } catch (error) {
        console.error('Error handling like:', error);
      }
    };
  
    useEffect(() => {
      const fetchLikeStatus = async () => {
        if (!userId) return;
  
        try {
          const { data, error } = await supabase
            .from('likes')
            .select()
            .match({ user_id: userId, post_id: postId })
            .maybeSingle();
  
          if (error) throw error;
          setLiked(!!data);
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      };
  
      fetchLikeStatus();
    }, [userId, postId]);
  
    return { liked, likesCount, toggleLike };
  };
  