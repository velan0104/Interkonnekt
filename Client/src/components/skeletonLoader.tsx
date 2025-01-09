import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 h-6 w-3/4 rounded mb-4"></div>
      <div className="bg-gray-700 h-4 w-1/2 rounded mb-2"></div>
      <div className="bg-gray-700 h-4 w-full rounded mb-2"></div>
      <div className="bg-gray-700 h-6 w-2/3 rounded"></div>
    </div>
  );
};
