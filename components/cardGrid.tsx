import React from "react";
import Card from "./card";
import styles from "./card.module.css";

interface CardProps {
  post_id: number;
  title: string;
  description: string;
  imageUrl: string[];
}

const CardGrid: React.FC<{ cards: CardProps[] }> = ({ cards }) => {
  return (
    <div className='flex flex-wrap -mx-4'>
      {cards.map((card) => (
        <div key={card.post_id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-8'>
          <Card {...card} />
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
