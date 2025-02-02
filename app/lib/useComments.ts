// app/lib/useComments.ts
import { supabase } from "@/app/lib/definitions";
import { useState, useEffect } from "react";

interface Comment {
  id: number;
  content: string;
  comment_at: string;
  user_id: string;
}

interface UseCommentsProps {
  post_id: number;
  user_id?: string;
}

export const useComments = ({ post_id, user_id }: UseCommentsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post_id)
      .order('comment_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  const saveComment = async (content: string) => {
    if (!user_id || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: post_id,
          user_id: user_id,
          content: content.trim()
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchComments();  // Refresh comments after submission
      return data;
    } catch (error) {
      console.error('Error saving comment:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { saveComment, isSubmitting, comments };
};
