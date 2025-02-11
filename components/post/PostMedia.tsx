"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Post } from "@/app/lib/types";
import styles from "@/components/postComponent.module.css";

interface PostMediaProps {
  post: Post;
}

const PostMedia: React.FC<PostMediaProps> = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handlePrevious = () => {
    const newIndex =
    currentImageIndex > 0 ? currentImageIndex - 1 : post.mediaUrl.length - 1;
    setCurrentImageIndex(newIndex);
    };

  const handleNext = () => {
    const newIndex =
    currentImageIndex < post.mediaUrl.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
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

  return (
    <div 
          className={post.is_video ? styles.videocontainer : styles.imagecontainer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {post.is_video ? (
            // Video display if the post is a video
            <video
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/video/${post.mediaUrl[currentImageIndex]}`}
              controls
              autoPlay
              loop
              className="w-full h-full object-contain filter brightness-95"
              playsInline
            />
          ) : (
            // Image display if the post is an image
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.mediaUrl[currentImageIndex]}`}
              alt={post.title}
              fill
              style={{ objectFit: "contain" }}
            />
          )}
          {post.mediaUrl.length > 1 && !post.is_video && (
            <div className={styles.navigation}>
              <button className={styles.navbutton} onClick={handlePrevious} aria-label="Previous Image">
                &lt;
              </button>
              <button className={styles.navbutton} onClick={handleNext} aria-label="Next Image">
                &gt;
              </button>
            </div>
          )}
          {!post.is_video && (
            <span className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {`${currentImageIndex + 1}/${post.mediaUrl.length}`}
            </span>
          )}
        </div>
  );
};

export default PostMedia;
