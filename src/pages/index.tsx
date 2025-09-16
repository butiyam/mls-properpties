import React from 'react';
import { useEffect } from 'react';
import { FaBath, FaBed, FaRuler  } from 'react-icons/fa';
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
  MRD_LACITY?: string;
  MRD_LEGALDESC?: string;
  MRD_MAIN_SQFT?: number;
  BedroomsTotal?: number;
  BathroomsFull?: number;
  ListPrice?: number;
  ListingKey?: string | number;
};



const [properties, setProperties] = React.useState<Property[]>([]);
  console.log(properties);
  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json()).then(data => setProperties(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Properties for Sale & Rent</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <>
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image  src={
            property.Media && property.Media.length > 0
              ? property.Media[0].MediaURL
              : "/placeholder.jpg"
          }
          layout='responsive'
          width={16}
          height={9}
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
        <div className="text-sm text-blue-400">0.0 (0)</div>
        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
          {property.PropertyType}
          </h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-3.866 3.582-7 8-7s8 3.134 8 7c0 3.866-3.582 7-8 7s-8-3.134-8-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V3" />
          </svg>
          {property.MRD_LASTREETNUMBER+' '+property.MRD_LASTREETNAME+', '+property.MRD_LACITY}
        </div>
        <p className="text-sm text-gray-500">
          {property.MRD_LEGALDESC}
        </p>

        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1">
           <FaRuler  size={20} />
            {property.MRD_MAIN_SQFT} sqft
          </div>
          <div className="flex items-center gap-1">
             <FaBed size={20} />
            Bed {property.BedroomsTotal}
          </div>
          <div className="flex items-center gap-1">
             <FaBath size={20} />
            Bath {property.BathroomsFull}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-blue-600">{new Intl.NumberFormat('en-US',{ style: 'currency', currency:'usd' }).format(property.ListPrice ?? 0)}</span>
          <a href={'/property-details/'+property.ListingKey} className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
            Details
          </a>
        </div>
      </div>
          </div>
    </>
        ))}
      </div>
    </div>
  );
}
