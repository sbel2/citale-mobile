import { supabase } from "@/app/lib/definitions";
import { useLikeStore } from "./useLikeStore";
import { useEffect } from "react";

interface UseLikeProps {
    postId: number;
    userId?: string;
    initialLikeCount: number;
}

export const useLike = ({ postId, userId, initialLikeCount }: UseLikeProps) => {
  const { likes, updateLike } = useLikeStore();
  const likesCount = likes[postId]?.count ?? initialLikeCount;
  const liked = likes[postId]?.liked ?? false;

  const fetchLikeStatus = async () => {
      if (!userId) return;

      try {
          const { data: likeData, error: likeError } = await supabase
              .from('likes')
              .select()
              .match({ user_id: userId, post_id: postId })
              .maybeSingle();

          if (likeError) throw likeError;

          const { data: postData, error: postError } = await supabase
              .from('posts')
              .select('like_count')
              .eq('post_id', postId)
              .single();

          if (postError) throw postError;

          updateLike(postId, postData.like_count, !!likeData);
      } catch (error) {
          console.error('Error fetching like status:', error);
      }
  };

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
      updateLike(postId, likesCount + 1, true); // Update Global State
  };

  const removeLike = async () => {
      if (!userId) return;

      const { error } = await supabase
          .from('likes')
          .delete()
          .match({ user_id: userId, post_id: postId });
      
      if (error) throw new Error(`Failed to remove like: ${error.message}`);

      await updatePostLikeCount(likesCount - 1);
      updateLike(postId, likesCount - 1, false); // Update Global State
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

  // Fetch like status when the component mounts or `postId`/`userId` changes
  useEffect(() => {
      fetchLikeStatus();
  }, [userId, postId]);

  // Subscribe to Supabase Realtime updates for this post's like count
  useEffect(() => {
      const channel = supabase
          .channel(`likes_update_${postId}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts', filter: `post_id=eq.${postId}` }, (payload) => {
              updateLike(postId, payload.new.like_count, liked);
          })
          .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, [postId, liked]);

  return { liked, likesCount, toggleLike };
};