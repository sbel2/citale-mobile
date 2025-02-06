"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import PostComponent from "@/components/postComponent"; 
import styles from "./card.module.css";
import Image from "next/image";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Post } from "@/app/lib/types";
import { supabase } from "@/app/lib/definitions";
import { useAuth } from 'app/context/AuthContext';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLike } from "@/app/lib/useLikes";

const Card: React.FC<{ post: Post }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postIdFromURL = searchParams.get("postId");

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('avatar.png');
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    setIsOpen(postIdFromURL === post.post_id.toString());
  }, [postIdFromURL, post.post_id]);

  const handleClick = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("postId", post.post_id.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(true);
  };

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("postId");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const { liked, likesCount, toggleLike } = useLike({
    postId: post?.post_id || "",
    userId: user?.id || "",
    initialLikeCount: post?.like_count || 0,
  });

  const handleLike = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    toggleLike();
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!post.user_id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', post.user_id)
          .single();

        if (error) throw error;
        
        setUsername(data?.username || '');
        setAvatarUrl(data?.avatar_url || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, [post.user_id]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <div onClick={handleClick} className={styles["image-container"]}>
            {post.is_video ? (
              <>
                <video
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/video/${post.thumbnailUrl}`}
                  width={300}
                  height={200}
                  autoPlay
                  loop
                  muted
                  className="transition-transform duration-500 ease-in-out transform filter brightness-95"
                  playsInline
                />
                <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 bg-black bg-opacity-35 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </>
            ) : (
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.mediaUrl?.[0]}`}
                alt={post.title}
                width={300}
                height={200}
                className="transition-transform duration-500 ease-in-out transform"
              />
            )}
            <div className={styles["overlay"]}></div>
          </div>
          <div className="px-2 pt-3">
            <div className="text-xs sm:text-sm text-black">{post.title}</div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <VisuallyHidden>
          <h2>{post.title}</h2>
        </VisuallyHidden>
        <PostComponent post={post} context="popup" />
        <DialogClose onClick={handleClose} aria-label="Close" />
      </DialogContent>

      <div className="flex items-center justify-between px-2 py-3">
        {/* Profile Section */}
        <button onClick={() => router.push(`/account/profile/${post.user_id}`)} className="flex items-center">
          <div className="flex items-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${avatarUrl}`}
              alt="Profile"
              width={20}
              height={20}
              className="rounded-full"
            />
            <p className="text-xs ml-2 truncate max-w-[100px] text-gray-600">{username}</p>
          </div>
        </button>

        {/* Like Button */}
        <button className="flex items-center p-1" onClick={handleLike}>
          {liked ? (
            <svg fill="red" stroke="red" viewBox="0 0 24 24" className="w-4 h-4 mr-1">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg fill="none" stroke="black" viewBox="0 0 24 24" className="w-4 h-4 mr-1">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          <span className="text-xs">{likesCount}</span>
        </button>
      </div>
    </Dialog>
  );
};

export default Card;
