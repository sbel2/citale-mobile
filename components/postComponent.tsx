"use client";
import React, { useState, useEffect } from "react";
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


interface PostComponentProps {
  post: Post;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const postBucket = post.post_action == "post" ? "posts" : post.post_action == "draft" ? "drafts" : "";
  const postTable = post.post_action == "post" ? "posts" : post.post_action == "draft" ? "drafts" : "";

  const { comments: initialComments, saveComment, commentCount, deleteComment, likes, toggleLike, userLikes } = useComments({ post_id: post.post_id, user_id: user?.id });
  const [comments, setComments] = useState(initialComments);

  const { liked, likesCount, toggleLike: togglePostLike, likesFeed } = useLike({
    postId: post.post_id,
    userId: user?.id,
  });

  const { favorited, favoritesCount, toggleFavorite } = useFavorite({
    postId: post.post_id,
    userId: user?.id,
    initialFavoriteCount: post.favorite_count
  });

  async function handleLike() {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
        // Update state
        togglePostLike();
      }
  
      const handleFavorite = () => {
        if (!user) {
          setShowLoginPopup(true);
          return;
        }
        toggleFavorite();
      };

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  return (
    <>
      <div className={`${styles.card}`}>
        <PostMedia post={post} />
        <div className={`${styles.textcontainer} p-4 md:p-10`}>
          <PostHeader post={post} />
          <PostContent 
            post={post} 
            comments={comments} 
            deleteComment={deleteComment} 
            userId={user?.id} 
            likes={likes} 
            userLikes={userLikes}
            toggleLike={toggleLike}
            showLoginPopup={showLoginPopup}
            setShowLoginPopup={setShowLoginPopup}
            likesFeed={likesFeed}
          />
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
              onNewComment={saveComment}
              commentCount={commentCount}
          />
          <div className="fixed bottom-0 left-0 w-full h-1 bg-white p-2 shadow-md z-10 md:hidden"></div>
          </div>
        </div>
      
        <button
          className='fixed top-[80px] right-5 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full flex items-center justify-center'
          style={{ width: "30px", height: "30px", lineHeight: "30px" }}
          onClick={() => router.back()}
          aria-label='Close Post'
        >
          &#x2715;
        </button>
    </>
  );
};

export default PostComponent;
