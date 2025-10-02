import React from 'react';
import {  useState } from 'react';
import {  FaLocationArrow , FaDotCircle } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import dynamic from "next/dynamic";
import PlacesAutocompleteInput from '@/components/PlacesAutocompleteInput';
import PlacesAutocompleteInputMobile from '@/components/PlacesAutocompleteInputMobile';
import { SkeletonPropertyCard }  from "@/components/SkeletonPropertyCard ";
import Head from 'next/head';

const PropertyMap = dynamic(() => import("../components/PropertyMap"), { ssr: false });


export default function Home() {

type Property = {
  Media?: string;
  PropertyType?: string;
  StreetNumber?: number;
  StreetName?: string;
  StreetSuffix?: string;
  PostalCode?: number;
  City?: string;
  StateOrProvince?: string;
  PublicRemarks?: string;
  LivingArea?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListPrice?: number;
  ListingKey?: string | number;
  updatedAt?: string;
};

type Address = {
  streetnumber: string;
  streetname: string;
  city: string;
  state: string;
  postalcode: string;
};

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


 const [form, setForm] = useState({
    streetname: "",
    streetnumber: "",
    city: "Oak Brook",
    state: "IL",
    postalcode: "",
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
  const [limit] = useState(8); // Adjust as needed
  const [total, setTotal] = useState(0);
    
  const handleMapSelect = (address: Address[]) => {
     setInputValue(`${address[0].streetnumber} ${address[0].streetname}, ${address[0].city}, ${address[0].state} ${address[0].postalcode} `);
     setForm({ ...form, 
                  streetname: address[0].streetname, 
                  streetnumber: address[0].streetnumber,
                  city: address[0].city,
                  state: address[0].state,
                  postalcode: address[0].postalcode 
                });
    setShowMap(false); // close map after selection
  };


  const handleAddressSelect = (address: Address[]) => {
    //setSelectedAddress(address);
     //setForm({ ...form, streetnumber: address[0].streetnumber });
     //setForm({ ...form, streetname: address[0].streetname });
     setForm({ ...form, 
                  streetname: address[0].streetname, 
                  streetnumber: address[0].streetnumber,
                  city: address[0].city,
                  state: address[0].state,
                  postalcode: address[0].postalcode 
                });
   //  setForm({ ...form, postalcode: address[0].postalcode });
    console.log('Selected address from child:', address[0].city);
    // You can now use this to update filters or send API requests
  };


React.useEffect(() => {
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: form.city,
          streetname: form.streetname,
          streetnumber: form.streetnumber,
          state: form.state,
          postalcode: form.postalcode,
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
}, [page]); // run once on mount

  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: form.city,
          streetname: form.streetname,
          streetnumber: form.streetnumber,
          state: form.state,
          postalcode: form.postalcode,
          priceMin: form.minPrice,
          priceMax: form.maxPrice,
          bed: form.bed,
          bath: form.bath,
          limit: limit
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
{ /* inside component render: */}
<div className="w-full h-full">
  {showMap ? (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Left side - homepage content */}
      <div className="w-full md:w-[60%] h-1/2 md:h-full overflow-y-auto">
        {/* put your homepage sections here */}
        { /* Hero + search + listings */ }
        <section className="relative min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden px-0">
        {/* Background Image */}
        <Image src="/bg-hero.jpg" width={700} height={700} alt="Home search background" className="absolute inset-0 w-full h-full object-cover opacity-70 z-0" />
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
                className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-r border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
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
                className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
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
                className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
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
                className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
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
                  className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
                  className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
                  className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
                  className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
          {loading ?
           Array.from({ length: 8 }).map((_, i) => <SkeletonPropertyCard key={i} />)

    :
    <></>
  }
  { !loading && properties.length > 0 ?
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">
      SHOWING {page == 1 ? page : 20*page - 20+1} - {total > 20 ? 20*page : total  } OF {total} LISTINGS
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        { properties.map((property, index) => (
          <Link key={index} href={`/property-details/${property.ListingKey}`}>
          <div  className="rounded-lg shadow border bg-white overflow-hidden">
              <div className="relative">
                <Image src={property.Media?.length? property.Media[0]: '/placeholder.png'} width={100} height={100} alt={property.ListingKey+" Img"} className="w-full h-48 object-cover" />
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
      </div>

      {/* Right side - map */}
     <div className="w-full md:w-[40%] h-1/2 md:h-full">
        <PropertyMap
          onSelectLocation={handleMapSelect}
          onClose={() => setShowMap(false)}
        />
      </div>
    </div>
  ) : (
    <>
      {/* Normal homepage */}
      { /* Hero + search + listings */ }
      <section className="relative min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden px-0">
      {/* Background Image */}
      <Image src="/bg-hero.jpg" width={700} height={700} alt="Home search background" className="absolute inset-0 w-full h-full object-cover opacity-70 z-0" />

  {/* Main Content */}
  <div className="relative z-10 w-full flex flex-col items-center justify-center pt-0 md:pt-8 m-5">
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
          className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-r border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
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
          className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[140px]"
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
          className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
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
          className="text-[#e6f1c6] h-16 px-5 py-3 text-md border-l border-[#e6f1c6] outline-none bg-white min-w-[100px]"
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
            className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
            className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
            className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
            className="text-[#e6f1c6] w-full py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none"
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
        {loading ?
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
    <></>
  }
  { !loading && properties.length > 0 ?
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">
      SHOWING {page == 1 ? page : 20*page - 20+1} - {total > 20 ? 20*page : total  } OF {total} LISTINGS
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        { properties.map((property, index) => (
          <Link key={index} href={`/property-details/${property.ListingKey}`}>
          <div className="rounded-lg shadow border bg-white overflow-hidden">
              <div className="relative">
                <Image src={ property.Media && property.Media.length > 0 ? property.Media[0]
                          : "/placeholder.png"}
                           width={100} height={100} alt={property.ListingKey+" Img"} className="w-full h-48 object-cover" />
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
  )}
</div>

  
    </>
  );
}
