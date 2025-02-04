import { supabase } from "@/app/lib/definitions";
import { useState, useEffect } from "react";
import { UserProfile } from "./types";

interface Comment {
  id: number;
  content: string;
  comment_at: string;
  user_id: string;
  profiles?: UserProfile;
}

interface UseCommentsProps {
  post_id: number;
  user_id?: string;
}

export const useComments = ({ post_id, user_id }: UseCommentsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch comments initially
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq("post_id", post_id)
        .order("comment_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      setComments(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new comment and manually update comments list
  const saveComment = async (content: string) => {
    if (!user_id || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([{ post_id, user_id, content: content.trim() }])
        .select(`*, profiles (username, avatar_url)`) // Fetch inserted comment with profile data
        .single();

      if (error) throw error;

      if (data) {
        setComments((prev) => [data, ...prev]);
      }

      return data;
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments(); // Load existing comments when component mounts
  }, [post_id]);

  return { saveComment, isSubmitting, isLoading, comments };
};
