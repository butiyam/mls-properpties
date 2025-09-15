// src/components/PropertyCard.tsx

import React from 'react';

interface PropertyCardProps {
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  sqft: number;
  beds: number;
  baths: number;
  price: string;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  title,
  location,
  description,
  sqft,
  beds,
  baths,
  price,
  featured = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        {featured && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </span>
        )}
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm text-blue-400">0.0 (0)</div>
        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">{title}</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-3.866 3.582-7 8-7s8 3.134 8 7c0 3.866-3.582 7-8 7s-8-3.134-8-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V3" />
          </svg>
          {location}
        </div>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            {sqft} sqft
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Bed {beds}
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 20h8M5 12h14M5 8h14" />
            </svg>
            Bath {baths}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-blue-600">{price}</span>
          <button className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
