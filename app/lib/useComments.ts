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
  const [likes, setLikes] = useState<{ [key: number]: number }>({}); // Like counts

  // Fetch comments and likes initially
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

      // Fetch likes count for each comment
      const likesData: { [key: number]: number } = {};
      for (const comment of data || []) {
        const { count, error: likeError } = await supabase
          .from("comment_likes")
          .select("id", { count: "exact" })
          .eq("comment_id", comment.id);

        if (likeError) {
          console.error("Error fetching likes:", likeError);
          continue;
        }

        likesData[comment.id] = count || 0;
      }
      setLikes(likesData);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle like for a comment
  const toggleLike = async (commentId: number) => {
    if (!user_id) {
      alert("Please log in to like a comment.");
      return;
    }

    const { data: existingLike, error: likeError } = await supabase
      .from("comment_likes")
      .select("*")
      .eq("user_id", user_id)
      .eq("comment_id", commentId)
      .single();

    if (likeError && likeError.code !== "PGRST116") {
      console.error("Error checking like:", likeError);
      return;
    }

    if (existingLike) {
      // Unlike
      await supabase
        .from("comment_likes")
        .delete()
        .eq("id", existingLike.id);

      setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 1) - 1 }));
    } else {
      // Like
      await supabase
        .from("comment_likes")
        .insert([{ user_id, comment_id: commentId }]);

      setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
    }
  };

  // Save a new comment
  const saveComment = async (content: string) => {
    if (!user_id || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{ post_id, user_id, content: content.trim() }])
        .select("*")
        .single();

      if (error) throw error;

      if (newComment) {
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
        setLikes((prev) => ({ ...prev, [newComment.id]: 0 }));

        return newCommentWithProfile;
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setCommentCount((prevCount) => prevCount - 1);
      setLikes((prev) => {
        const newLikes = { ...prev };
        delete newLikes[commentId];
        return newLikes;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    setCommentCount(comments.length);
  }, [comments]);

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  return { saveComment, deleteComment, isSubmitting, isLoading, comments, commentCount, likes, toggleLike };
};
