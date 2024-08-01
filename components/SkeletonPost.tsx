// components/SkeletonCardRow.tsx

import React from 'react';

const SkeletonPost = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse w-full max-w-xs mx-auto">
      <div className="h-80 bg-gray-300 rounded-md mb-4"></div>
    </div>
  );
};

const SkeletonCardRow = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 40 }).map((_, index) => (
          <SkeletonPost key={index} />
        ))}
      </div>
    );
  };
  
  export default SkeletonCardRow;