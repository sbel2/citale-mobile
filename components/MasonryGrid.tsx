"use client";

import React from "react";
import Masonry from "react-masonry-css";
import { Post } from "@/app/lib/types";
import Card from "@/components/card";

interface MasonryGridProps {
  posts: Post[] | null;
  managePost?: (manageType: string, postId: string, postAction: string) => void; // Optional prop, function that handles the post
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ posts , managePost }) => {
  const breakpointColumnsObj = {
    default: 5,
    1300: 4,
    1020: 3,
    750: 2,
  };

  console.log(posts);
  return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts?.map((post) => (
          <div key={post.post_id}> {/* Adjust bottom margin */}
            <Card post={post} managePost={managePost? managePost : undefined}/>
          </div>
        ))}
      </Masonry>
  );
};

export default MasonryGrid;
