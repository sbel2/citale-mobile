import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import PostComponent from "@/components/postComponent"; 
import { X } from "lucide-react";
import styles from "./card.module.css";
import Image from "next/image";

interface CardProps {
  post: {
    post_id: number;
    title: string;
    description: string;
    imageUrl: string[];
    like_count: number;
    created_at: string;
    user_id: number;
  };
}

const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <div className={styles['image-container']}>
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.imageUrl[0]}`}
              alt={post.title}
              width={300}
              height={200}
              className="transition-transform duration-500 ease-in-out transform"
            />
            <div className={styles['overlay']}></div>
          </div>
          <div className="px-2 py-3">
            <div className="text-sm sm:text-base mb-1 2xl:mb-2 line-clamp-3 text-black">
              {post.title}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <PostComponent {...post}/>
        <DialogClose className="absolute top-5 right-5 bg-gray-600 bg-opacity-50 text-white p-2 rounded-full cursor-pointer" aria-label="Close">
          <X className="h-6 w-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Card;
