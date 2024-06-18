import React from "react";
import Image from "next/image";

interface CardProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ id, name, description, imageUrl }) => {
  return (
    <div className="max-w-lg bg-white rounded-sm overflow-hidden shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="relative h-96 bg-center">
          <Image
            src={imageUrl}
            layout="fill"
            style={{ objectFit: "cover" }}
            alt={name}
            className="rounded-t"
          />
        </div>
        <div className="px-6 py-2">
          <div className="text-2xl mb-2 uppercase line-clamp-2">{name}</div>
          <p className="text-gray-700 py-2 text-base truncate">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
