"use client";
import React from "react";
import styles from "@/components/postComponent.module.css";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useState } from "react";
import CommentPopup from "./CommentPopup";

interface PostFooterProps {
    liked: boolean;
    likesCount: number;
    handleLike: () => void;
    favorited: boolean;
    favoritesCount: number;
    handleFavorite: () => void;
    showLoginPopup: boolean;
    setShowLoginPopup: (value: boolean) => void;
    post_id: number;
    user_id: string;
    onNewComment: (content: string) => Promise<void>;
}

const PostFooter: React.FC<PostFooterProps> = ({ liked, likesCount, handleLike, favorited, favoritesCount, handleFavorite, showLoginPopup, setShowLoginPopup, post_id, user_id, onNewComment }) => {
  const router = useRouter();
  const [showCommentPopup, setShowCommentPopup] = useState(false);

//login popup logic for comment
  const handleCommentClick = () => {
    if (!user_id) {
        setShowLoginPopup(true);
        return;
    }
    setShowCommentPopup(true);
    };

  return (
    <div className={styles.footer}>
   {!showCommentPopup ? (
        <input
          type="text"
          placeholder="Say something..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          onFocus={() => handleCommentClick()}
        />
      ) : (
        <CommentPopup onClose={() => setShowCommentPopup(false)} post_id={post_id} user_id={user_id} onNewComment={onNewComment} />
      )}
    <button className="flex items-center p-1 pr-2 gap-1" onClick={handleLike}>
        {liked ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="red" fill="red">
            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        )}
        <span className="text-xs inline-block w-4 text-center">{likesCount}</span>
    </button>

    <button className="flex items-center p-1 pr-2 gap-1" onClick={handleFavorite}>
        {favorited ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFD700" fill="#FFD700">
            <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        )}
        <span className="text-xs inline-block w-4 text-center">{favoritesCount}</span>
    </button>

    <button className="flex items-center p-1 pr-3 gap-1" onClick={handleCommentClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <path d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C17.5222 2 22 6.28357 22 11.5667Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span className="text-xs inline-block w-4 text-center">3</span>
    </button>


    {showLoginPopup && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-3">
            <Image src="/citale_header.svg" alt="Citale Logo" width={100} height={60} priority />
        </div>
        <p className="text-sm text-gray-600 mb-6">
            We are so glad you like Citale! <br /><br />
            Please sign in or sign up to interact with the community.
        </p>
        <div className="flex justify-center gap-6">
            <button
            className="bg-[#fd0000] hover:bg-[#fd0000] text-white px-4 py-2 rounded mr-2"
            onClick={() => router.push('/log-in')}
            >
            Log in
            </button>
            <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => setShowLoginPopup(false)}
            >
            Cancel
            </button>
        </div>
        </div>
    </div>
    )}
    </div>
  );
};

export default PostFooter;
