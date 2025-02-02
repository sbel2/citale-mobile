"use client";
import React from "react";
import Linkify from 'react-linkify';
import { Post } from "@/app/lib/types";
import styles from "@/components/postComponent.module.css";
import { useComments } from '@/app/lib/useComments';

interface PostContentProps {
  post: Post;
  user_id?: string;
}

const PostContent: React.FC<PostContentProps> = ({ post, user_id }) => {
    
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const address = post.mapUrl;
  const { comments } = useComments({ post_id: post.post_id, user_id });

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

        {/* Comments section */}
        <div className="mt-8 mb-20">
          <h5 className="text-lg font-bold mb-4">Comments</h5>
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p>{comment.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.comment_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default PostContent;


