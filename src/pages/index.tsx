import React from 'react';
import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRuler, FaMapMarker, FaHome } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import ClipLoader from "react-spinners/ClipLoader";

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
  PublicRemarks?: string;
  LivingArea?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListPrice?: number;
  ListingKey?: string | number;
};

 const [form, setForm] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bed: "",
    bath: "",
  });

 const [properties, setProperties] = React.useState<Property[]>([]);
 const [page, setPage] = useState(1);
 const [limit] = useState(12); // Adjust as needed
 const [total, setTotal] = useState(0);
  
  useEffect(() => {
    fetch(`/api/properties?page=${page}&limit=${limit}&city=${form.location}&priceMin=${form.minPrice}&priceMax=${form.maxPrice}&bed=${form.bed}&bath=${form.bath}`)
      .then(res => res.json()).then(data => {
         setProperties(Array.isArray(data.data) ? data.data : []);
         setTotal(data.total);
        })
      .catch(err => console.error(err));
     // console.log(form)
  }, [page, limit, form]);
  
  const totalPages = Math.ceil(total / limit);

    
  return (
    <>
    <section className="relative min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden px-0">
      {/* Background Image */}
      <img
        src="/bg-hero.jpg"
        alt="Home search background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-0 md:pt-8">
        {/* Heading */}
        <h1 className="text-white text-center font-serif font-bold text-4xl md:text-7xl mb-8 md:mb-12 drop-shadow-lg max-w-4xl px-4 md:px-0">
          Find a home<br className="md:hidden" /> in style
        </h1>
        {/* Search Bar */}
        <form className="w-full max-w-5xl md:mx-auto">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex flex-row gap-0 bg-[#2d3243] shadow-lg border border-[#e6f1c6] rounded-full items-center overflow-hidden">
            <input
              type="text"
              placeholder="City"
              className="text-[#e6f1c6] h-16 px-6 py-3 w-full text-xl outline-none border-none rounded-none bg-white flex-1"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <select
              className="text-[#e6f1c6] h-16 px-5 py-3 text-lg border-r border-l border-[#e6f1c6]  outline-none bg-white min-w-[140px]"
              value={form.minPrice}
              onChange={e => setForm({ ...form, minPrice: e.target.value })}
            >
              <option value="">Min Price</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
              <option value="200000">$200,000</option>
            </select>
            <select
              className="text-[#e6f1c6] h-16 px-5 py-3 text-lg border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
              value={form.maxPrice}
              onChange={e => setForm({ ...form, maxPrice: e.target.value })}
            >
              <option value="">Max Price</option>
              <option value="200000">$200,000</option>
              <option value="400000">$400,000</option>
              <option value="600000">$600,000</option>
            </select>
            <select
              className="text-[#e6f1c6] h-16 px-5 py-3 text-lg border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
              value={form.bed}
              onChange={e => setForm({ ...form, bed: e.target.value })}
            >
              <option value="">Bed</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <select
              className="text-[#e6f1c6] h-16 px-5 py-3 text-lg border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
              value={form.bath}
              onChange={e => setForm({ ...form, bath: e.target.value })}
            >
              <option value="">Bath</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          {/* Mobile: stacked layout */}
          <div className="md:hidden flex flex-col gap-3 bg-[#2d3243] border border-[#e6f1c6] rounded shadow-lg px-3 py-4 w-full">
            <div className="flex w-full gap-2 items-center">
              <input
                type="text"
                placeholder="City"
                className="text-[#e6f1c6] flex-1 py-3 px-2 text-lg border border-[#e6f1c6] rounded focus:outline-none"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <select
                className="text-[#e6f1c6] w-full py-3 px-2 text-lg border border-[#e6f1c6] rounded focus:outline-none"
                value={form.minPrice}
                onChange={e => setForm({ ...form, minPrice: e.target.value })}
              >
                <option value="">Min Price</option>
                <option value="50000">$50,000</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
              </select>
              <select
                className="text-[#e6f1c6] w-full py-3 px-2 text-lg border border-[#e6f1c6] rounded focus:outline-none"
                value={form.maxPrice}
                onChange={e => setForm({ ...form, maxPrice: e.target.value })}
              >
                <option value="">Max Price</option>
                <option value="200000">$200,000</option>
                <option value="400000">$400,000</option>
                <option value="600000">$600,000</option>
              </select>
              <select
                className="text-[#e6f1c6] w-full py-3 px-2 text-lg border border-[#e6f1c6] rounded focus:outline-none"
                value={form.bed}
                onChange={e => setForm({ ...form, bed: e.target.value })}
              >
                <option value="">Bed</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select
                className="text-[#e6f1c6] w-full py-3 px-2 text-lg border border-[#e6f1c6] rounded focus:outline-none"
                value={form.bath}
                onChange={e => setForm({ ...form, bath: e.target.value })}
              >
                <option value="">Bath</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </section>
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <>
          <div key={index} className="bg-[#FFF] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
           <div className="relative">
            <Image  src={
                property.Media && property.Media.length > 0
                  ? property.Media[0].MediaURL
                  : "/placeholder.jpg"
              }
              width={400}
              height={300}
              loading='lazy'
              style={{borderRadius: '16px', padding: '10px', maxWidth:'100%', maxHeight: '250px'}}
             
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
        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
        {property.BedroomsTotal + ' BR | '+property.BathroomsTotalInteger+' BA |'+(property.LivingArea)?.toLocaleString()+' Sqft'}
          </h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarker fill='#00BFA6' />
          {property.UnparsedAddress}
        </div>
        <p className="text-sm text-gray-500">
          
        </p>

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
          <span className="text-sm font-bold text-[#00BFA6] pl-2">
            {new Intl.NumberFormat('en-US',{ style: 'currency', currency:'usd' }).format(property.ListPrice ?? 0)}
          </span>
          <a href={'/property-details/'+property.ListingKey} className="flex bg-[#00BFA6] text-white px-4 py-1 rounded">
          <FaHome  className='mt-0.5 mr-2'/>  Details
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
