import React from "react";
import Image from "next/image";

type PropertyCardProps = {
  image: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  address: string;
  mls: string;
  isNew?: boolean;
};
export const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  price,
  beds,
  baths,
  sqft,
  status,
  address,
  mls,
  isNew,
}) => (
  <div className="rounded-lg shadow border bg-white overflow-hidden">
    <div className="relative">
      <Image src={image} width={100} height={100} alt={address} className="w-full h-48 object-cover" />
      {isNew && (
        <span className="absolute left-2 top-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">New</span>
      )}
      <button className="absolute right-2 top-2 bg-white/80 rounded-full p-1">
        <svg width={20} height={20} fill="none" stroke="currentColor">
          <path d="M10 17l-6-6a6 6 0 018-8 6 6 0 018 8l-6 6z" />
        </svg>
      </button>
    </div>
    <div className="p-4">
      <div className="flex flex justify-around mb-1">
        <h1 className="text-xl text-[#1b3c55] font-bold ">${price}</h1>
        <span className="text-[#000000de] font-medium text-md">{status}</span>
       </div>
      <div className="text-xs text-[#000000de] inline-flex flex justify-around font-bold mb-2 flex gap-2 items-center">
        <span>{beds} Beds</span>
        <span>|</span>
        <span>{baths} Baths</span>
        <span>|</span>
        <span>{sqft} sqft</span>
      </div>
      <div className="text-sm text-[#000000de] font-medium mb-1">{address}</div>
      <div className="text-xs text-gray-400">MLS# {mls}</div>
    </div>
  </div>
);
