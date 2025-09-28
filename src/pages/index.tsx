import React from 'react';
import {  useState } from 'react';
import { FaBath, FaBed, FaRuler, FaMapMarker, FaHome, FaLocationArrow } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import dynamic from "next/dynamic";
import PlacesAutocompleteInput from '@/components/PlacesAutocompleteInput';
import PlacesAutocompleteInputMobile from '@/components/PlacesAutocompleteInputMobile';
import Head from 'next/head';

const PropertyMap = dynamic(() => import("../components/PropertyMap"), { ssr: false });


export default function Home() {

type Property = {
  Media?: string;
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
    location: "Oak Brook",
    minPrice: "",
    maxPrice: "",
    bed: "",
    bath: "",
  });

  const [inputValue, setInputValue] = useState("Oak Brook, IL, USA");
  const [showMap, setShowMap] = useState(false);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Adjust as needed
  const [total, setTotal] = useState(0);
    
  const handleMapSelect = (address: string) => {
    setInputValue(address);
    setForm({ ...form, location: address });
    setShowMap(false); // close map after selection
  };

  const handleAddressSelect = (address: string) => {
    //setSelectedAddress(address);
    setForm({ ...form, location: address });
    console.log('Selected address from child:', address);
    // You can now use this to update filters or send API requests
  };


React.useEffect(() => {
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: form.location,
          priceMin: form.minPrice,
          priceMax: form.maxPrice,
          bed: form.bed,
          bath: form.bath,
          page,
          limit,
        }
      });
      setProperties(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []); // run once on mount

  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: form.location,
          priceMin: form.minPrice,
          priceMax: form.maxPrice,
          bed: form.bed,
          bath: form.bath
        }
      });

      setProperties(res.data.data);
      setTotal(res.data.total);
     // setLoading(false);
      //setShowMap(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

    
  return (
    <>
      <Head>
        <title>Home | Oak Brook Reality</title>
      </Head>
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
    <form className="w-full max-w-5xl md:mx-auto" onSubmit={handleSearch}>
      {/* Desktop */}
      <div className="hidden md:flex flex-row gap-0 bg-[#2d3243] shadow-lg border border-[#e6f1c6] rounded-full items-center overflow-hidden">
        <PlacesAutocompleteInput inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />
        <select
          id="minPrice"
          style={{ backgroundColor: '#000' }}
          className="text-[#e6f1c6] h-16 px-5 py-3 text-lg border-r border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
          value={form.minPrice}
          onChange={e => setForm({ ...form, minPrice: e.target.value })}
        >
          <option value="">Min Price</option>
          <option value="50000">$50,000</option>
          <option value="100000">$100,000</option>
          <option value="200000">$200,000</option>
        </select>
        <select
          id="maxPrice"
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
          id="bed"
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
          id="bath"
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
       
        {/* Map Button */}
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-5  ml-2 flex items-center gap-2"
          onClick={() => setShowMap(true)}

        >
          <FaLocationArrow size={24} />
        </button>
          {/* Search Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-5 rounded-r-full flex items-center gap-2"
        >
        Search
        </button>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-3 bg-[#2d3243] border border-[#e6f1c6] rounded shadow-lg px-3 py-4 w-full">
        <PlacesAutocompleteInputMobile inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <select
            id="minPriceMobile"
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
            id="maxPriceMobile"
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
            id="bedMobile"
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
            id="bathMobile"
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

        {/* Buttons for Mobile */}
        <div className="flex pt-2">
          <button
            type="button"
            className="flex text-center justify-center w-[80px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-l"
            onClick={() => setShowMap(true)}
          >
          <FaLocationArrow  size={24} />
          </button>
            <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-r"
          >
          Search
          </button>
        </div>
      </div>
    </form>
  </div>  
</section>

{ /* inside component render: */}
{showMap && (
  <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-[9000]">
    <PropertyMap
      onSelectLocation={handleMapSelect}
      onClose={() => {
        console.log("Parent onClose called");
        setShowMap(false);
      }}
    />
  </div>
)}
    {loading ?
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
    <></>
  }
  { !loading && properties.length > 0 ?
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">SHOWING {page == 1 ? page : 12*page - 12+1} - {12*page} OF {total} LISTINGS</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        { properties.map((property, index) => (
          <div key={index} className="bg-[#FFF] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
           <div className="relative">
            <Image  src={ property.Media && property.Media.length > 0 ? property.Media[0]
                  : "/placeholder.png"}
              width={500}
              height={200}
              loading='lazy'
              style={{borderRadius: '16px', padding: '10px', maxWidth:'500', maxHeight: '200px'}}
             
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
    :<></>
      }
  { !loading && properties.length == 0 ?
      <>
        <div className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold text-center text-black">FOUND 0 RESULT.</h1>
        </div>
      </>
      :
      <></>

    }
    </>
  );
}
