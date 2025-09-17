import React from 'react';
import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRuler, FaMapMarker, FaHome } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
export default function Home() {

type MediaItem = {
  MediaURL: string;
};

type Property = {
  Media?: MediaItem[];
  PropertyType?: string;
  MRD_LASTREETNUMBER?: string;
  MRD_LASTREETNAME?: string;
  UnparsedAddress?: string;
  MRD_LEGALDESC?: string;
  LivingArea?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListPrice?: number;
  ListingKey?: string | number;
};

 const [properties, setProperties] = React.useState<Property[]>([]);
 const [page, setPage] = useState(1);
 const [limit] = useState(12); // Adjust as needed
 const [total, setTotal] = useState(0);
  
  useEffect(() => {
    fetch(`/api/properties?page=${page}&limit=${limit}`)
      .then(res => res.json()).then(data => {
         setProperties(Array.isArray(data.data) ? data.data : []);
         setTotal(data.total);
        })
      .catch(err => console.error(err));
  }, [page, limit]);
  
  const totalPages = Math.ceil(total / limit);

    if (properties.length === 0) return <div>Loading...</div>;
    if (properties) 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Properties for Sale & Rent</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property, index) => (
          <>
          <div key={index} className="bg-[#FFF] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
           <div className="relative">
            <Image  src={
                property.Media && property.Media.length > 0
                  ? property.Media[0].MediaURL
                  : "/placeholder.jpg"
              }
              layout='responsive'
              width={16}
              height={9}
              style={{borderRadius: '16px', padding: '10px'}}
              objectFit='cover' 
              alt="Property image"
            />
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
         Gravenhurst Cottage
          </h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarker/>
          {property.UnparsedAddress}
        </div>
        <p className="text-sm text-gray-500">
          {property.MRD_LEGALDESC}
        </p>

        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1">
           <FaRuler  size={20} />
            {property.LivingArea} sqft
          </div>
          <div className="flex items-center gap-1">
             <FaBed size={20} />
            Bed {property.BedroomsTotal}
          </div>
          <div className="flex items-center gap-1">
             <FaBath size={20} />
            Bath {property.BathroomsTotalInteger}
          </div>
        </div>

        <div className="bg-[#E9EBEC] rounded-lg flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-[#00BFA6] pl-2">
            {new Intl.NumberFormat('en-US',{ style: 'currency', currency:'usd' }).format(property.ListPrice ?? 0)}
          </span>
          <a href={'/property-details/'+property.ListingKey} className="flex bg-gray-900 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
          <FaHome className='mt-0.5 mr-2'/>  Details
          </a>
        </div>
      </div>
          </div>
    </>
        ))}
      </div>
        {/* Pagination controls */}
      <div className="flex gap-2 mt-8 justify-center items-center">
        <button
          className="text-black px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-medium">Page {page} of {totalPages}</span>
        <button
          className="text-black px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      
    </div>
  );
}
