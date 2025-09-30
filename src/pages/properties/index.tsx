import React from 'react';
import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRuler, FaMapMarker, FaHome } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import HeroSlider from '@/components/HeroSlider';
import ClipLoader from "react-spinners/ClipLoader";
import Head from 'next/head';


export default function Properties() {

  const title = `Available Properties | Oak Brook Reality`;

type Property = {
  Media?: string;
  PropertyType?: string;
  StreetNumber?: number;
  StreetName?: string;
  StreetSuffix?: string;
  PostalCode?: number;
  City?: string;
  StateOrProvince?: string;
  MRD_LEGALDESC?: string;
  LivingArea?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListPrice?: number;
  ListingKey?: string | number;
};

 const [properties, setProperties] = React.useState<Property[]>([]);
 const [page, setPage] = useState(1);
 const [limit] = useState(20); // Adjust as needed
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

    
  return (
  
    <>
       <Head>
        <title>{title}</title>
      </Head>
    <HeroSlider/>
    {properties.length === 0 ?
  <div style={{
      display: "flex",
      background:'#2d3243',
      justifyContent: "center",
      alignItems: "center",
      height: "100px",      // full viewport height for vertical centering
    }}>
      <ClipLoader size={50} color="#e6f1c6" />
    </div>
    :
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">Properties for Sale</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property, index) => (
          
          <div key={index} className="bg-[#FFF] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
           <div className="relative">
            <Image  src={ property.Media && property.Media.length > 0 ? property.Media[0]
                  : "/placeholder.png"}
              width={500}
              height={200}
              style={{borderRadius: '16px', padding: '10px', maxWidth: '500px', maxHeight:'200px'}}
              alt="Property image"
            />
          <span className="hidden absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        
        <div className="hidden absolute top-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-md font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
          {property.BedroomsTotal + ' BR | '+property.BathroomsTotalInteger+' BA |'+(property.LivingArea)?.toLocaleString()+' Sqft'}
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarker fill='#00BFA6' />
          {property.StreetNumber+' '+property.StreetName+' '+property.StreetSuffix+', '+property.City+', '+property.StateOrProvince+' '+property.PostalCode}
        </div>

        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1">
           <FaRuler fill='#00BFA6'  size={20} />
            {property.LivingArea} sqft
          </div>
          <div className="flex items-center gap-1">
             <FaBed fill='#00BFA6' size={20} />
            Bed {property.BedroomsTotal}
          </div>
          <div className="flex items-center gap-1">
             <FaBath fill='#00BFA6' size={20} />
            Bath {property.BathroomsTotalInteger}
          </div>
        </div>

        <div className="bg-[#E9EBEC] rounded-lg flex justify-between items-center mt-3">
          <span className="text-md font-bold text-[#00BFA6] pl-2">
            {new Intl.NumberFormat('en-US',{ style: 'currency', currency:'usd' }).format(property.ListPrice ?? 0)}
          </span>
          <a href={'/property-details/'+property.ListingKey} className="flex bg-[#00BFA6] text-white px-4 py-1 rounded">
          <FaHome className='mt-0.5 mr-2'/>  Details
          </a>
        </div>
      </div>
          </div>
    
        ))}
      </div>
        {/* Pagination controls */}
      <div className="flex gap-2 mt-8 justify-center items-center">
        <button
          className="text-white px-3 py-1 rounded bg-black disabled:opacity-40"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-black font-medium">Page {page} of {totalPages}</span>
        <button
          className="text-white px-3 py-1 rounded bg-black disabled:opacity-40"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      
    </div>
    </>
    }
    </>
  );
}
