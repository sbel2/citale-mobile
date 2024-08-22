import React from 'react';
import Masonry from 'react-masonry-css';
import Card from '@/components/card';

const MasonryGrid = ({ posts }) => {
  const breakpointColumnsObj = {
    default: 5,
    1400: 4,
    1020: 3,
    750: 2
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {posts.map((post) => (
        <Card 
          key={post.post_id}
          post_id={post.post_id.toString()}
          title={post.title}
          description={post.description}
          imageUrl={post.imageUrl}
          created_at={post.created_at}
          like_count={post.like_count}
        />  
      ))}
    </Masonry>
  );
};

export default MasonryGrid;
