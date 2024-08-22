import React from "react";
import styles from "./card.module.css";
import PostDialog from "@/components/PostDialog";

interface Post {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
  like_count: number;
  created_at: string;
  user_id: number;
}

interface CardProps extends Post {}

const Card: React.FC<CardProps> = (props) => {
  return (
    <div className={styles.card}>
      <PostDialog post={props} />
    </div>
  );
};

export default Card;
