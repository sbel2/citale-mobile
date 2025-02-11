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
  context: 'popup' | 'static'; 
}

const PostComponent: React.FC<PostComponentProps> = ({ post, context }) => {
  
  const headerClass = context === 'popup' ? styles.popup : styles.static;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const postBucket = post.post_action == "post" ? "posts" : post.post_action == "draft" ? "drafts" : "";
  const postTable = post.post_action == "post" ? "posts" : post.post_action == "draft" ? "drafts" : "";

  const { comments: initialComments, saveComment, commentCount, deleteComment, likes, toggleLike } = useComments({ post_id: post.post_id, user_id: user?.id });
  const [comments, setComments] = useState(initialComments);

  const { liked, likesCount, toggleLike: togglePostLike } = useLike({
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
  
    try {
      if (!liked) {
        // Increment the like count in the 'likes' table
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, post_id: post.post_id }]);
  
        if (insertError) {
          console.error('Error adding like:', insertError.message);
          return;
        }
  
        // Increment the like count in the 'posts' table
        const { error: updateError } = await supabase
          .from(postTable)
          .update({ like_count: likesCount + 1 })
          .eq('post_id', post.post_id);
  
        if (updateError) {
          console.error('Error updating post like count:', updateError.message);
          return;
        }
  
        // Update state
        setLikesCount((prev) => prev + 1);
      } else {
        // Remove the like from the 'likes' table
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.post_id);
  
        if (deleteError) {
          console.error('Error removing like:', deleteError.message);
          return;
        }
  
        // Decrement the like count in the 'posts' table
        const { error: updateError } = await supabase
          .from(postTable)
          .update({ like_count: likesCount - 1 })
          .eq('post_id', post.post_id);
  
        if (updateError) {
          console.error('Error updating post like count:', updateError.message);
          return;
        }
  
        // Update state
        setLikesCount((prev) => prev - 1);
      }
  
      // Toggle the like state
      setLiked(!liked);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };
  

  const handleBack = () => {
    setTimeout(() => {
        router.push('/');
    }, 0);
};

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext(); // Swipe left to move to the next image
    }

    if (touchEndX.current - touchStartX.current > 50) {
      handlePrevious(); // Swipe right to move to the previous image
    }
  }

  useEffect(() => {
    const handleFetchUserProfile = async () => {
      // Fetch user profile data from the server
      const {data, error} = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', post.user_id)
        .single();
      if (error) {
        console.error('Error fetching user profile:', error.message);
        return;
      }
      if(data){
        setUsername(data?.username || '');
        setAvatarUrl(data?.avatar_url || '');
        console.log(data);
      }
    };
    handleFetchUserProfile();
  }, [post.user_id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', user.id)
          .eq('post_id', post.post_id)
          .single();
  
        if (error) {
          console.error('Error fetching like status:', error.message);
          return;
        }
  
        setLiked(!!data);
      }
    };
  
    fetchLikeStatus();
  }, [user, post.post_id]);

  useEffect(() => {
    const fetchUpdatedLikeCount = async () => {
      try {
        const { data, error } = await supabase
          .from(postTable)
          .select('like_count')
          .eq('post_id', post.post_id)
          .single();
          
        if (error) {
          console.error('Error fetching updated like count:', error.message);
          return;
        }
  
        if (data) {
          setLikesCount(data.like_count); // Update the likesCount state with the latest value
        }
      } catch (err) {
        console.error('Error fetching updated like count:', err);
      }
    };
  
    fetchUpdatedLikeCount();
  }, [post.post_id, postTable]);  

  const handleFavorite = async () => {
    togglePostLike();
  };

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
      <div className={`${styles.card} ${headerClass}`}>
        <PostMedia post={post} />
        <div className={`${styles.textcontainer} p-4 md:p-10`}>
          <PostHeader post={post} />
          <PostContent 
            post={post} 
            comments={comments} 
            deleteComment={deleteComment} 
            userId={user?.id} 
            likes={likes} 
            toggleLike={toggleLike}
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
          </div>
        </div>
        {context === 'static' && (
              <button
                className='fixed top-5 right-5 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full flex items-center justify-center'
                style={{ width: "30px", height: "30px", lineHeight: "30px" }}
                onClick={() => router.push('/')}
                aria-label='Close Post'
              >
                &#x2715;
              </button>
            )}
    </>
  );
};

export default PostComponent;
