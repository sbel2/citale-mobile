"use client";

import React from "react";
import Masonry from "react-masonry-css";
import Card from "@/components/card";

const MasonryGrid = ({ posts }) => {
  const breakpointColumnsObj = {
    default: 5,
    1300: 4,
    1020: 3,
    750: 2,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {posts?.length > 0 ? (
        posts.map((post) => (
          <div key={post.post_id}>
            <Card post={post} />
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}

      
    </Masonry>
  );
};

export default MasonryGrid;
