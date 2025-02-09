"use client";
import React from "react";
import Linkify from 'react-linkify';
import { Post } from "@/app/lib/types";
import styles from "@/components/postComponent.module.css";
import Image from 'next/image';
import { useState } from 'react';
import { IoIosMore } from 'react-icons/io';

interface PostContentProps {
  post: Post;
  comments: any[];
  deleteComment: (commentId: number) => void;
  userId?: string;
}

const PostContent: React.FC<PostContentProps> = ({ post, comments, deleteComment, userId }) => {
    
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const address = post.mapUrl;
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  function isValidUrl(href: string): boolean {
    try {
        new URL(href);
        return true;
    } catch (_) {
        return false;
    }
  }

  const linkDecorator = (href: string, text: string, key: number): React.ReactNode => {
    // Validate the URL
    if (!isValidUrl(href)) {
      return <span key={key}>{text}</span>;  // Just return text if URL is invalid
    }
  
    return (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
        {text}
      </a>
    );
  };
  
  return (
    <div className={`${styles.content} mt-8 mb-2`}>
        <h4 className='text-lg font-bold mb-4 text-black'>
            {post.title}
        </h4>
        <div className={styles.preformattedtext}>
            <Linkify componentDecorator={linkDecorator}>{post.description}</Linkify>
        </div>
        {/* map visualization code */}
        {address && (
            <div className="flex justify-end w-full h-40 items-center bg-white rounded-lg pt-4">
            {(() => {
            const encodedAddress = encodeURIComponent(address);
            const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
            return (
                <iframe
                className="w-full h-36 border-none rounded-lg"
                src={mapUrl}
                ></iframe>
            );
            })()}
            </div>
        )}
        <div className='text-xs text-gray-500 mt-10'>{post.created_at}</div>
      
      <div className='border-t border-gray-200 mt-8'></div>
      {/* Comments section */}
      <div className="mt-4 mb-20">
        {comments.map((comment) => {
          const profile = comment.profiles || {};
          return (
            <div key={comment.id} className="mb-4 p-3 bg-white flex items-start">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${profile.avatar_url || "avatar.png"}`}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{profile.username || "Unknown User"}</p>
                <p>{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.comment_at).toLocaleString()}
                </p>
              </div>
              <div className="relative ml-auto">
                {/* More Options Button */}
                {comment.user_id === userId && (
                  <button 
                    onClick={() => setOpenMenu(openMenu === comment.id ? null : comment.id)} 
                    className="ml-auto text-gray-600 hover:text-gray-800"
                  >
                    <IoIosMore size={20} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {openMenu === comment.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg border rounded z-20">
                    <button
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setOpenMenu(null); // Close menu
                        setShowConfirm(comment.id); // Show confirmation popup
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {showConfirm === comment.id && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-base mb-6">
                      Are you sure you want <br /><br /> to delete this comment?
                    </p>
                    <div className="flex justify-center gap-6">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        onClick={() => setShowConfirm(null)} // Cancel
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#fd0000] hover:bg-[#e00000] text-white px-4 py-2 rounded"
                        onClick={() => {
                          deleteComment(comment.id);
                          setShowConfirm(null); // Close popup after deletion
                        }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostContent;


