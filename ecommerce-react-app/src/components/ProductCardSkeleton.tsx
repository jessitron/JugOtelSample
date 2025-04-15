import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
      {/* Skeleton for Title/Description (placed first as per current layout) */}
      <div className="mb-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div> {/* Skeleton Title */}
        <div className="h-3 bg-gray-300 rounded w-full mb-1"></div> {/* Skeleton Desc line 1 */}
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>    {/* Skeleton Desc line 2 */}
      </div>
      {/* Skeleton for Image */}
      <div className="flex justify-center items-center h-48 w-48 sm:h-72 sm:w-72 md:h-96 md:w-96 bg-gray-200 rounded-lg mx-auto mb-3"></div>
      {/* Skeleton for Price/Button */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Skeleton Price */}
        <div className="h-8 bg-gray-300 rounded w-1/3"></div> {/* Skeleton Button */}
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 