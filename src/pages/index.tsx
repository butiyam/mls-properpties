import React,{  useState, useRef } from 'react';
import {  FaLocationArrow , FaDotCircle, FaBed, FaCamera , FaSearch } from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import dynamic from "next/dynamic";
import PlacesAutocompleteInput from '@/components/PlacesAutocompleteInput';
import PlacesAutocompleteInputMobile from '@/components/PlacesAutocompleteInputMobile';
import { SkeletonPropertyCard }  from "@/components/SkeletonPropertyCard ";
import PriceFilter from '@/components/PriceFilter';
import BedsBathsModal from '@/components/BedsBathsModal';
import FilterModal from '@/components/FilterModal';
import { PropertyData } from '@/lib/types';
import Head from 'next/head';
import ServicesSection from "@/components/ServicesSection";
import AboutUsSection from '@/components/AboutUsSection';
import ClientTestimonials from '@/components/ClientTestimonials';
import BookAppointment from '@/components/BookAppointment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from '../components/HeroSlider.module.css';


const slides = [
  {
    image: '/gallery1.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery2.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery3.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery4.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery5.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery6.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  // Add more slides as needed
];

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
  PhotosCount?: number;
  StandardStatus?: string;
  StateOrProvince?: string;
  PublicRemarks?: string;
  LivingArea?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  ListPrice?: number;
  ListingKey?: string | number;
  OriginalEntryTimestamp?: string;
};

type Address = {
  streetnumber: string;
  streetname: string;
  city: string;
  state: string;
  postalcode: string;
};

function isNew(dateString: string): boolean {
  const ONE_DAY_MS = 168 * 60 * 60 * 1000; // milliseconds in 7 days

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

async function getLatLngFromAddress(address: string): Promise<{ lat: number; lng: number }> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if(data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  } else {
    throw new Error("Geocoding error: " + data.status);
  }
}

 const [form, setForm] = useState({
    streetname: "",
    streetnumber: "",
    city: "",
    state: "",
    postalcode: "",
    minPrice: 0,
    maxPrice: 0,
    bed: "",
    bath: "",
  });

  const divRef = useRef<HTMLDivElement>(null);
  const contentdivRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bedbathsmodalOpen, setBedBathsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address[]>([]);
  const [inputValue, setInputValue] = useState("Oak Brook, IL, USA");
  const [showMap, setShowMap] = useState(false);
  const [propertyData, setPropertyData] = React.useState<PropertyData[]>([]); 
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // Adjust as needed
  const [total, setTotal] = useState(0);
    
  const handleFocusClick = () => {
    // Make the element focusable first if it’s a div
    if (divRef.current) {
      divRef.current.focus(); // Keyboard focus
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll top
    }
    

  };

  const handleMapSelect = async (address: Address[]) => {
      setForm({ ...form, 
                  streetname: address[0].streetname, 
                  streetnumber: address[0].streetnumber,
                  city: address[0].city,
                  state: address[0].state,
                  postalcode: address[0].postalcode 
                });
    console.log('Selected address from child:', address[0].city);
    // You can now use this to update filters or send API requests
    setLoading(true);
    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: address[0].city,
          streetname: address[0].streetname,
          streetnumber: address[0].streetnumber,
          state: address[0].state,
          postalcode: address[0].postalcode,
          page,
          limit,
        }
      });

    // Usage:
    const rawProperties: PropertyData[] = res.data.data; // your API raw data
    setPropertyData(await processProperties(rawProperties));


      setProperties(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    //setShowMap(false); // close map after selection
  };


  const handleAddressSelect = (address: Address[]) => {
      setSelectedAddress(address);
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
   console.log(inputValue);
    console.log('Selected address from child:', address[0].city);
    // You can now use this to update filters or send API requests
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function processProperties(rawProps: any[]) {
  const processedProps = await Promise.all(
    rawProps.map(async (prop) => {
      const latLng = await getLatLngFromAddress(
        `${prop.StreetNumber} ${prop.StreetName} ${prop.StreetSuffix}, ${prop.City}, ${prop.StateOrProvince} ${prop.PostalCode}`
      );
      
      return {
        ListingKey: prop.ListingKey || 'unknown',
        lat: latLng.lat,
        lng: latLng.lng,
        price: prop.ListPrice,
        beds: prop.BedroomsTotal,
        baths: prop.BathroomsTotalInteger,
        sqft: prop.LivingArea,
        address: `${prop.StreetNumber} ${prop.StreetName} ${prop.StreetSuffix}, ${prop.City}, ${prop.StateOrProvince} ${prop.PostalCode}`,
        image: prop.Media[0] || '/placeholder.svg',
      };
    })
  );

  return processedProps;
}

React.useEffect(() => {
  const fetchProperties = async () => {
    setLoading(true);
    try {
      console.log(form.city)
      const res = await axios.get("/api/properties", {
        params: {
          city: form.city? form.city : 'Oak Brook',
          streetname: form.streetname,
          streetnumber: form.streetnumber,
          state: 'IL',
          postalcode: form.postalcode,
          priceMin: form.minPrice,
          priceMax: form.maxPrice,
          bed: form.bed,
          bath: form.bath,
          page,
          limit,
        }
      });

    // Usage:
    const rawProperties: PropertyData[] = res.data.data; // your API raw data
    setPropertyData(await processProperties(rawProperties));


      setProperties(res.data.data);
      setTotal(res.data.total);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [page]); // run once on mount

  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (contentdivRef.current) {
        contentdivRef.current?.focus();
      contentdivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll top
    }

    const parts = inputValue? inputValue.split(',').map(s => s.trim()) : [];

    try {
      const res = await axios.get("/api/properties", {
        params: {
          city: selectedAddress.length > 0 ?  selectedAddress[0].city  : (parts.length > 0? parts[0] : ''),
          streetname: form.streetname,
          streetnumber: form.streetnumber,
          state: selectedAddress.length > 0 ? selectedAddress[0].state : (parts.length > 0? parts[1] : ''),
          postalcode: form.postalcode,
          priceMin: form.minPrice,
          priceMax: form.maxPrice,
          bed: form.bed,
          bath: form.bath,
          limit: limit
        }
      });

      const rawProperties: PropertyData[] = res.data.data; // your API raw data
      setPropertyData(await processProperties(rawProperties));
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
      <div className="w-full md:w-[50%] h-1/2 md:h-full overflow-y-auto">
        {/* put your homepage sections here */}
        { /* Hero + search + listings */ }
        <div className={styles.heroWrapper}>
      {/* Swiper only for images in the background */}
      <Swiper
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        slidesPerView={1}
        speed={900}
        className={styles.heroSwiper}
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={styles.slideBg}
              style={{ backgroundImage: `url(${src.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Overlay content: Fixed on top of Swiper */}
      <div className={styles.overlay}>
        <h1 className={styles.title}>Find a home <span className="text-[#00bfa6]">in style</span></h1>
        {/* Your search bar or search component */}
        <div className={styles.searchBar}>
          {/* ...Search bar JSX... */}
           <form className="w-full max-w-5xl p-2 md:mx-auto" onSubmit={handleSearch}>
          {/* Desktop */}
          <div className="hidden md:flex flex-row gap-0 bg-[#ffffff1a] shadow-lg border border-[#ffffff5c] rounded-xl items-center overflow-hidden">
            <PlacesAutocompleteInput inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />      

            <PriceFilter
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              minDefault={0}
              maxDefault={2000000}
              onApply={(_min, _max) => {
                setForm({ ...form, minPrice: _min, maxPrice: _max })
                console.log('Min:'+_min+', Max:'+_max)
                // Filter your property listings here
              }}
            />
            <button className='search-input text-[#FFF] h-16 px-5 py-3 text-md border-l border-[#ffffff5c] outline-none min-w-[140px] clickable' 
                    onClick={() => setModalOpen(true)}>
                    $ Price
            </button>

            <BedsBathsModal
              open={bedbathsmodalOpen}
              onClose={() => setBedBathsModalOpen(false)}
              onApply={(beds: string, baths: string) => {
                // Filter your property listings here
                setForm({ ...form, bed: beds, bath: baths })
                  console.log('Beds:'+beds+', Baths:'+baths)
              }}
            />
            <button className='flex justify-between items-center search-input text-[#FFF] h-16 px-5 py-3 text-md border-l border-[#ffffff5c] outline-none min-w-[160px] clickable' 
                    onClick={() => setBedBathsModalOpen(true)}>
                  <FaBed />  Beds & Baths
            </button>       
            {/* Map Button */}
            <button
              type="button"
              className="search-input hover:bg-blue-700 text-white font-bold px-4 py-5 border-l border-[#ffffff5c] flex items-center gap-2 cursor-pointer"
              onClick={() => setShowMap(true)}

            >
              <FaLocationArrow size={24} />
            </button>
              {/* Search Button */}
            <button
              type="submit"
              className="bg-[#00bfa6] hover:opacity-86 text-white font-bold px-6 py-5 border-l border-[#ffffff5c] flex items-center gap-2 cursor-pointer"
            >
          <FaSearch/>  Search
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3 bg-[#ffffff1a] border border-[#ffffff5c] rounded shadow-lg px-3 py-4 w-full">

            <div className="flex gap-2 pt-2">
            <PlacesAutocompleteInputMobile inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />
              <FilterModal
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              onApply={(filters) => {
                // Filter your listings here based on filters
                setForm({ ...form, 
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice,
                        bed: filters.bedrooms,
                        bath: filters.bathrooms 
                      })
              }}
            />
            <button className='text-[#FFF] search-input w-[80px] border border-[#ffffff5c] rounded shadow-lg' onClick={() => setFilterOpen(true)}>Filters</button>
            </div>

            {/* Buttons for Mobile */}
            <div className="flex pt-2">
              <button
                type="button"
                className="flex text-center justify-center w-[80px] search-input hover:bg-blue-700 text-white font-bold py-3 rounded-l cursor-pointer"
                onClick={() => setShowMap(true)}
              >
              <FaLocationArrow  size={24} />
              </button>
                <button
                type="submit"
                className="flex-1 bg-[#00bfa6] hover:opacity-86 text-white font-bold py-3 rounded-r cursor-pointer"
              >
              Search
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
      </div>
          {loading ?
           Array.from({ length: 8 }).map((_, i) => <SkeletonPropertyCard key={i} />)

    :
    <></>
  }
  { !loading && properties.length > 0 ?
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">
         {form.city? form.city : 'Oak Brook'} Properties
     {/* SHOWING {page == 1 ? page : 20*page - 20+1} - {(total > 20 ? 20*page : total) > total ? total : (total > 20 ? 20*page : total)  } OF {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0,}).format(Number(total))} LISTINGS */}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        { properties.map((property, index) => (
          <Link key={index} href={`/property-details/${property.ListingKey}`}>
          <div  className="rounded-lg shadow border bg-white overflow-hidden">
              <div className="relative">
                <Image src={property.Media?.length? property.Media[0]: '/placeholder.svg'} width={100} height={100} alt={property.ListingKey+" Img"} className="w-full h-48 object-cover" />
                {isNew(property.OriginalEntryTimestamp? property.OriginalEntryTimestamp : '') ?
                  <>
                  <span className="absolute left-2 top-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">New</span>
                  </>
                  :<></>
                }
                  <button  className="flex bg-[#0009] photo-badge pl-10 pr-10 absolute right-2 top-2 text-[#FFF] items-center text-xs rounded" >
                  <FaCamera />
                   <span className="pl-2 text-xs">{property.PhotosCount}</span>
                  </button>
              </div>
              <div className="p-4">
                <div className="flex flex justify-between mb-1">
                  <h1 className="text-xl text-[#1b3c55] font-bold ">{new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0,}).format(Number(property.ListPrice))}</h1>
                  <span className="flex gap-2 items-center text-[#000000de] font-medium text-sm">
                  <FaDotCircle fill={property.StandardStatus === 'Active' ? 'green' : 'red' } />
                  {property.StandardStatus}
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
     <div className="w-full md:w-[50%] h-1/2 md:h-full">
        <PropertyMap
          onSelectLocation={handleMapSelect}
          properties={propertyData}
          onClose={() => setShowMap(false)}
         
        />
      </div>
    </div>
  ) : (
    <>
      {/* Normal homepage */}
      { /* Hero + search + listings */ }
   
      {/* Main Content */}

        {/* Heading */}
      <div className={styles.heroWrapper}>
      {/* Swiper only for images in the background */}
      <Swiper
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        slidesPerView={1}
        speed={900}
        className={styles.heroSwiper}
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={styles.slideBg}
              style={{ backgroundImage: `url(${src.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Overlay content: Fixed on top of Swiper */}
      <div className={styles.overlay}>
        <h1 className={styles.title}>Find a home <span className="text-[#00bfa6]">in style</span></h1>
        {/* Your search bar or search component */}
        <div className={styles.searchBar}>
          {/* ...Search bar JSX... */}
           <form className="w-full max-w-5xl p-2 md:mx-auto" onSubmit={handleSearch}>
          {/* Desktop */}
          <div className="hidden md:flex flex-row gap-0 bg-[#ffffff1a] shadow-lg border border-[#ffffff5c] rounded-xl items-center overflow-hidden">
            <PlacesAutocompleteInput inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />      

            <PriceFilter
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              minDefault={0}
              maxDefault={2000000}
              onApply={(_min, _max) => {
                setForm({ ...form, minPrice: _min, maxPrice: _max })
                console.log('Min:'+_min+', Max:'+_max)
                // Filter your property listings here
              }}
            />

            <button className='search-input text-[#FFF] h-16 px-5 py-3 text-md border-l border-[#ffffff5c] outline-none min-w-[140px] clickable' 
                    onClick={() => setModalOpen(true)}>
                    $ Price
            </button>

            <BedsBathsModal
              open={bedbathsmodalOpen}
              onClose={() => setBedBathsModalOpen(false)}
              onApply={(beds: string, baths: string) => {
                // Filter your property listings here
                setForm({ ...form, bed: beds, bath: baths })
                  console.log('Beds:'+beds+', Baths:'+baths)
              }}
            />
            <button className='flex justify-between items-center search-input text-[#FFF] h-16 px-5 py-3 text-md border-l border-[#ffffff5c] outline-none min-w-[160px] clickable' 
                    onClick={() => setBedBathsModalOpen(true)}>
                  <FaBed />  Beds & Baths
            </button>       
            {/* Map Button */}
            <button
              type="button"
              className="search-input hover:bg-blue-700 text-white font-bold px-4 py-5 border-l border-[#ffffff5c] flex items-center gap-2 cursor-pointer"
              onClick={() => setShowMap(true)}

            >
              <FaLocationArrow size={24} />
            </button>
              {/* Search Button */}
            <button
              type="submit"
              className="bg-[#00bfa6] hover:opacity-86 text-white font-bold px-6 py-5 border-l border-[#ffffff5c] flex items-center gap-2 cursor-pointer"
            >
          <FaSearch/>  Search
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3 bg-[#ffffff1a] border border-[#ffffff5c] rounded shadow-lg px-3 py-4 w-full">

            <div className="flex gap-2 pt-2">
            <PlacesAutocompleteInputMobile inputValue={inputValue} setInputValue={setInputValue} onAddressSelect={handleAddressSelect} />
              <FilterModal
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              onApply={(filters) => {
                // Filter your listings here based on filters
                setForm({ ...form, 
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice,
                        bed: filters.bedrooms,
                        bath: filters.bathrooms 
                      })
              }}
            />
            <button className='text-[#FFF] search-input w-[80px] border border-[#ffffff5c] rounded shadow-lg' onClick={() => setFilterOpen(true)}>Filters</button>
            </div>

             <div className="hidden flex gap-2 pt-2">
              <button className="search-input text-[#FFF] w-full flex-1  py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none" >
                <Link href="/view-properties">Browse Properties</Link>
              </button>
              <button onClick={handleFocusClick} className='search-input text-[#FFF] w-full flex-1  py-3 px-2 text-md border border-[#e6f1c6] rounded focus:outline-none'>
                Get in Touch
              </button>
             </div>

            {/* Buttons for Mobile */}
            <div className="flex pt-2">
              <button
                type="button"
                className="flex text-center justify-center w-[80px] search-input hover:bg-blue-700 text-white font-bold py-3 rounded-l cursor-pointer"
                onClick={() => setShowMap(true)}
              >
              <FaLocationArrow  size={24} />
              </button>
                <button
                type="submit"
                className="flex-1 bg-[#00bfa6] hover:opacity-86 text-white font-bold py-3 rounded-r cursor-pointer"
              >
              Search
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
      </div>
     
   
      <ServicesSection />
      <AboutUsSection/>

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
    <div ref={contentdivRef} tabIndex={-1} className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-8">
        {form.city? form.city : 'Oak Brook'} Properties
    {/*  SHOWING {page == 1 ? page : 20*page - 20+1} - {(total > 20 ? 20*page : total) > total ? total : (total > 20 ? 20*page : total)  } OF {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0,}).format(Number(total))} LISTINGS */}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        { properties.map((property, index) => (
          <Link key={index} href={`/property-details/${property.ListingKey}`}>
          <div className="rounded-lg shadow border bg-white overflow-hidden">
              <div className="relative">
                <Image src={ property.Media && property.Media.length > 0 ? property.Media[0]
                          : "/placeholder.svg"}
                           width={100} height={100} alt={property.ListingKey+" Img"} className="w-full h-48 object-cover" />
                {isNew(property.OriginalEntryTimestamp? property.OriginalEntryTimestamp : '') ?
                  <>
                  <span className="absolute left-2 top-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">New</span>
                  </>
                  :<></>
                }
                 <button  className="flex bg-[#0009] photo-badge pl-10 pr-10 absolute right-2 top-2 text-[#FFF] items-center text-xs rounded" >
                  <FaCamera />
                   <span className="pl-2 text-xs">{property.PhotosCount}</span>
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

      <ClientTestimonials />
      <div  ref={divRef}
        tabIndex={-1}>
        <BookAppointment  />
      </div>
    </>
  )}
</div>
    </>
  );
}
