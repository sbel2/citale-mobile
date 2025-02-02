"use client";
import React, { useState } from "react";
import styles from "./postComponent.module.css";
import { useRouter } from 'next/navigation';
import { Post } from "@/app/lib/types";
import { useAuth } from 'app/context/AuthContext';
import { useLike } from 'app/lib/useLikes';
import { useFavorite } from 'app/lib/useFavorites';
import { useComments } from 'app/lib/useComments'; // Add this import
import PostHeader from "./post/PostHeader";
import PostMedia from "./post/PostMedia";
import PostContent from "./post/PostContent";
import PostFooter from "./post/PostFooter";
import CommentPopup from "./post/CommentPopup";

interface PostComponentProps {
  post: Post; 
  context: 'popup' | 'static'; 
}

const PostComponent: React.FC<PostComponentProps> = ({ post, context }) => {
  const headerClass = context === 'popup' ? styles.popup : styles.static;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);

  const { 
    comments, 
    isLoading: commentsLoading, 
    saveComment, 
    isSubmitting: isCommentSubmitting 
  } = useComments({ 
    post_id: post.post_id, 
    user_id: user?.id 
  });

  const handleBack = () => {
    setTimeout(() => {
        router.push('/');
    }, 0);
  };

  const { liked, likesCount, toggleLike } = useLike({
    postId: post.post_id,
    userId: user?.id,
    initialLikeCount: post.like_count
  });

  const { favorited, favoritesCount, toggleFavorite } = useFavorite({
    postId: post.post_id,
    userId: user?.id,
    initialFavoriteCount: post.favorite_count
  });

  const handleLike = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    toggleLike();
  };

  const handleFavorite = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    toggleFavorite();
  };

  return (
    <>
      <div className={`${styles.card} ${headerClass}`}>
        <PostMedia post={post} />
        <div className={`${styles.textcontainer} p-4 md:p-10`}>
          <PostHeader post={post} />
          <PostContent post={post} />
          <PostFooter 
              liked={liked}
              likesCount={likesCount}
              handleLike={handleLike}
              favorited={favorited}
              favoritesCount={favoritesCount}
              handleFavorite={handleFavorite}
              showLoginPopup={showLoginPopup}
              setShowLoginPopup={setShowLoginPopup}
              post_id={post.post_id}
              user_id={user?.id || ''}
          />
          </div>
        </div>
        {context === 'static' && (
              <button
                className='fixed top-5 right-5 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full flex items-center justify-center'
                style={{ width: "30px", height: "30px", lineHeight: "30px" }}
                onClick={handleBack}
                aria-label='Close Post'
              >
                &#x2715;
              </button>
            )}
    </>
  );
};

export default PostComponent;
