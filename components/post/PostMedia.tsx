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

  // We’ll keep track if the user touched a button, so we skip swipe
  const isTouchOnButton = useRef(false);

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // If the user’s finger started on a button, bail out
    if ((e.target as HTMLElement).closest(`button`)) {
      isTouchOnButton.current = true;
      return;
    } else {
      isTouchOnButton.current = false;
    }

    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // If touch started on a button, skip
    if (isTouchOnButton.current) return;

    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // If touch started on a button, skip
    if (isTouchOnButton.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      // Swipe left => next
      handleNext();
    } else if (distance < -50) {
      // Swipe right => previous
      handlePrevious();
    }
  };

  const postBucket =
    post.post_action === "post"
      ? "posts"
      : post.post_action === "draft"
      ? "drafts"
      : "";

  return (
    <div
      className={post.is_video ? styles.videocontainer : styles.imagecontainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {post.is_video ? (
        <video
          src={`${process.env.NEXT_PUBLIC_IMAGE_CDN}/${postBucket}/videos/${post.mediaUrl[currentImageIndex]}`}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
          playsInline
        />
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_CDN}/${postBucket}/images/${post.mediaUrl[currentImageIndex]}`}
          alt={post.title}
          fill
          style={{ objectFit: "contain" }}
        />
      )}

      {post.mediaUrl.length > 1 && !post.is_video && (
        <div className={styles.navigation}>
          <button
            className={styles.navbutton}
            aria-label="Previous Image"
            onClick={handlePrevious}
          >
            &lt;
          </button>
          <button
            className={styles.navbutton}
            aria-label="Next Image"
            onClick={handleNext}
          >
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
