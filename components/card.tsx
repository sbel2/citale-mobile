import React from "react";
import Link from "next/link";
import styles from "./card.module.css";
import Image from "next/image";

interface CardProps {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

const Card: React.FC<CardProps> = ({ post_id, title, imageUrl }) => {
  return (
    
        <div>
          <div className={styles['image-container']}>
            <Link href={`/events/${post_id}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl[0]}`}
                alt={title}
                width = {300}
                height={200}
                className = 'transition-transform duration-500 ease-in-out transform'
              />
              <div className={styles['overlay']}></div>
            </Link>
          </div>
          <div className='px-6 py-2'>
            <div className='text-1xl mb-2 line-clamp-3 text-black'>
              {title}
            </div>
          </div>
        </div>

  );
};

export default Card;
