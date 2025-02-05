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
  const [commentCount, setCommentCount] = useState(0);

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
      setCommentCount(data?.length || 0);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new comment and manually update comments list
  const saveComment = async (content: string) => {
    if (!user_id || !content.trim()) return;
  
    setIsSubmitting(true);
    try {
      // Insert the new comment
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{ post_id, user_id, content: content.trim() }])
        .select("*")
        .single();
  
      if (error) throw error;
  
      if (newComment) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user_id)
          .single();
  
        if (profileError) throw profileError;
  
        const newCommentWithProfile = {
          ...newComment,
          profiles: profile || { username: "Unknown User", avatar_url: "avatar.png" },
        };
  
        setComments((prev) => [newCommentWithProfile, ...prev]);
        setCommentCount((prevCount) => prevCount + 1);
  
        return newCommentWithProfile;
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCommentCount(comments.length);
  }, [comments]);
  
  useEffect(() => {
    fetchComments(); // Load existing comments when component mounts
  }, [post_id]);

  return { saveComment, isSubmitting, isLoading, comments, commentCount};
};
