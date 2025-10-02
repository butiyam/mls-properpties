import React from "react";

export const SkeletonPropertyCard = () => (
  <div className="rounded-lg shadow border bg-white overflow-hidden animate-pulse">
    <div className="relative bg-gray-300 w-full h-48" />
    <div className="p-4">
      <div className="flex justify-around mb-1">
        <div className="bg-gray-300 rounded w-20 h-6" /> {/* Price placeholder */}
        <div className="bg-gray-300 rounded w-16 h-5" /> {/* Status placeholder */}
      </div>
      <div className="text-xs inline-flex justify-around font-bold mb-2 flex gap-2 items-center text-gray-400">
        <div className="bg-gray-300 rounded w-12 h-4" /> {/* Beds */}
        <span>|</span>
        <div className="bg-gray-300 rounded w-12 h-4" /> {/* Baths */}
        <span>|</span>
        <div className="bg-gray-300 rounded w-16 h-4" /> {/* Sqft */}
      </div>
      <div className="bg-gray-300 rounded w-5/6 h-5 mb-1" /> {/* Address */}
      <div className="bg-gray-300 rounded w-1/3 h-4" /> {/* MLS */}
    </div>
  </div>
);
