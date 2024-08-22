import React from "react";
import styles from "./card.module.css";
import Image from "next/image";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";

interface CardProps {
  post_id: string;
  title: string;
  description: string;
  imageUrl: string[];
}

interface DialogContentProps {
  post: Post;
}

const Card: React.FC<CardProps> = ({ post_id, title, description, imageUrl }) => {
  return (
    <Dialog>
    <DialogTrigger asChild>
    <div className={styles.card}>
      <div className={styles['image-container']}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl[0]}`}
            alt={title}
            width={300}
            height={200}
            className='transition-transform duration-500 ease-in-out transform'
          />
          <div className={styles['overlay']}></div>
      </div>
      <div className="px-2 py-3">
        <div className="text-sm sm:text-base mb-1 2xl:mb-2 line-clamp-3 text-black">
          {title}
        </div>
      </div>
    </div>
    </DialogTrigger>
    <DialogContent> </DialogContent>
    </Dialog>
  );
};

export default Card;
