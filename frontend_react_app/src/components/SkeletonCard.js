import React from "react";

/**
 * PUBLIC_INTERFACE
 * SkeletonCard - Skeleton placeholder for PetCard.
 */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white/80 dark:bg-secondary border border-gray-200 dark:border-gray-800 rounded-lg shadow p-4 flex flex-col items-center min-w-[220px] max-w-[280px]">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-md w-full" style={{ height: 120 }} />
      <div className="h-5 w-4/6 bg-gray-200 dark:bg-gray-700 rounded mt-5 mb-2" />
      <div className="h-3 w-3/6 bg-gray-200 dark:bg-gray-700 rounded my-1" />
      <div className="h-3 w-5/12 bg-gray-200 dark:bg-gray-700 rounded my-1" />
      <div className="h-3 w-6/12 bg-gray-200 dark:bg-gray-700 rounded my-1 mb-3" />
      <div className="mt-4 h-9 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default SkeletonCard;
