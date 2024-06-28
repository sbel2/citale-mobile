import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";

interface CardProps {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

const Card: React.FC<CardProps> = ({ post_id, title, description, imageUrl }) => {
  return (
    <Link href={`/events/${post_id}`}>
      <div className='block overflow-hidden rounded-lg bg-white cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between p-2'>
        <div>
          <div className="relative w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageUrl[0]}`}
                alt={title}
                layout='responsive'
                width={500}
                height={600}
                objectFit='cover'
                className = 'transition-transform duration-500 ease-in-out transform'
              />
          </div>
          <div className='px-6 py-2'>
            <div className='text-1xl mb-2 line-clamp-2 text-black'>
              {title}
            </div>{" "}

          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
