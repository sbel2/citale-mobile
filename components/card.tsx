import React from "react";
import styles from "./card.module.css";
import Image from "next/image";
import PostDialog from "@/components/PostDialog";

interface CardProps {
  post_id: string;
  title: string;
  description: string;
  imageUrl: string[];
}

const Card: React.FC<CardProps> = ({ post_id, title, description, imageUrl }) => {
  // Create the post object to pass to the dialog
  const post = {
    post_id: Number(post_id),
    title,
    description,
    imageUrl,
    like_count: 0, // Placeholder, replace with actual data if available
    created_at: new Date().toISOString(), // Placeholder, replace with actual data
    user_id: 1, // Placeholder, replace with actual data
  };

  return (
    <div className={styles.card}>
      {/* PostDialog is now used here to handle dialog opening and content display */}
      <PostDialog post={post} />
    </div>
  );
};

export default Card;
