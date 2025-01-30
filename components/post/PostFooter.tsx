"use client";
import React from "react";
import styles from "@/components/postComponent.module.css";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PostFooterProps {
  liked: boolean;
  likesCount: number;
  handleLike: () => void;
  favorited: boolean;
  favoritesCount: number;
  handleFavorite: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({ liked, likesCount, handleLike, favorited, favoritesCount, handleFavorite }) => {
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <div className={styles.footer}>
    <button className="flex items-center p-1 pr-3" onClick={handleLike}>
        {liked ? (
        <svg
            fill="red"
            stroke="red"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        ) : (
        <svg
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        )}
        <span className="text-xs inline-block w-4 text-center">{likesCount}</span>
    </button>

    <button className="flex items-center p-1 pr-7" onClick={handleFavorite}>
        {favorited ? (
        <svg
            fill="#FFD700"
            stroke="#FFD700"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        ) : (
        <svg
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
            className={styles.icon}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        )}
        <span className="text-xs inline-block w-4 text-center">{favoritesCount}</span>
    </button>

    {/* Login popup */}
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
