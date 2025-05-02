"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/app/lib/types";
import styles from "@/components/postComponent.module.css";

interface PostMediaProps {
  post: Post;
}

const PostMedia: React.FC<PostMediaProps> = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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
    if ((e.target as HTMLElement).closest("button")) {
      isTouchOnButton.current = true;
      return;
    }
    isTouchOnButton.current = false;
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isTouchOnButton.current) return;
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (isTouchOnButton.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrevious();
  };

  const postBucket =
    post.post_action === "post"
      ? "posts"
      : post.post_action === "draft"
      ? "drafts"
      : "";

  useEffect(() => {
    const img = new window.Image();
    img.src = `${process.env.NEXT_PUBLIC_IMAGE_CDN}/${postBucket}/images/${post.mediaUrl[currentImageIndex]}`;
    img.onload = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = img.height / img.width;
        const calculatedHeight = containerWidth * aspectRatio;
        setDimensions({
          width: containerWidth,
          height: calculatedHeight,
        });
      }
    };
  }, [currentImageIndex, post.mediaUrl, postBucket]);

  return (
    <div
      ref={containerRef}
      className={post.is_video ? styles.videocontainer : styles.imagecontainer}
      style={!post.is_video ? { height: `${dimensions.height}px` } : {}}
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
          sizes="100vw"
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
        <span className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {`${currentImageIndex + 1}/${post.mediaUrl.length}`}
        </span>
      )}
    </div>
  );
};

export default PostMedia;
