import React from 'react';
import { useEffect, useState } from 'react';
import { FaDotCircle } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import HeroSlider from '@/components/HeroSlider';
import Head from 'next/head';
import Link from 'next/link';
import { SkeletonPropertyCard }  from "@/components/SkeletonPropertyCard ";


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
  updatedAt?: string;
};

 const [properties, setProperties] = React.useState<Property[]>([]);
 const [page, setPage] = useState(1);
 const [limit] = useState(20); // Adjust as needed
 const [total, setTotal] = useState(0);
  
 
function isNew(dateString: string): boolean {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // milliseconds in 1 day

  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Clear time parts for accurate day comparison (set to midnight)
  inputDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diff = currentDate.getTime() - inputDate.getTime();

  // If difference is 0 or 1 day, consider it new
  return diff >= 0 && diff <= ONE_DAY_MS;
}

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
     <>      
          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonPropertyCard />
            <SkeletonPropertyCard />
            <SkeletonPropertyCard />
            <SkeletonPropertyCard />
            </div>
          </div>
          </>
    :
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">Properties for Sale</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property, index) => (
             <Link key={index} href={`/property-details/${property.ListingKey}`}>
          <div  className="rounded-lg shadow border bg-white overflow-hidden">
              <div className="relative">
                    <Image  src={ property.Media && property.Media.length > 0 ? property.Media[0]
                          : "/placeholder.png"}
                      width={100} height={100} alt={property.ListingKey+" Img"} className="w-full h-48 object-cover"
                    />
                {isNew(property.updatedAt? property.updatedAt : '') ?
                  <>
                  <span className="absolute left-2 top-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">New</span>
                  </>
                  :<></>
                }
                <button className="hidden absolute right-2 top-2 bg-white/80 rounded-full p-1">
                  <svg width={20} height={20} fill="none" stroke="currentColor">
                    <path d="M10 17l-6-6a6 6 0 018-8 6 6 0 018 8l-6 6z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="flex flex justify-between mb-1">
                  <h1 className="text-xl text-[#1b3c55] font-bold ">{new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0,}).format(Number(property.ListPrice))}</h1>
                  <span className="flex gap-2 items-center text-[#000000de] font-medium text-sm">
                  <FaDotCircle fill='green' />{'Active'}
                  </span>
                 </div>
                <div className="text-xs text-[#000000de] inline-flex flex justify-around font-bold mb-2 flex gap-2 items-center">
                  <span>{property.BedroomsTotal} Beds</span>
                  <span>|</span>
                  <span>{property.BathroomsTotalInteger} Baths</span>
                  <span>|</span>
                  <span>{property.LivingArea} sqft</span>
                </div>
                <div className="text-sm text-[#000000de] font-medium mb-1">
                {property.StreetNumber+' '+property.StreetName+' '+property.StreetSuffix+', '+property.City+', '+property.StateOrProvince+' '+property.PostalCode}
                </div>
                <div className="text-xs text-gray-400">MLS# {property.ListingKey}</div>
              </div>
          </div>
          </Link>

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
