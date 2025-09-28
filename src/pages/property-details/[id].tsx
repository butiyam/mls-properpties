import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLink } from "react-icons/hi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import ClipLoader from "react-spinners/ClipLoader";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import axios from "axios";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';



export default function PropertyDetails() {

  const router = useRouter();
  const { id } = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  function diffInMonths(date1 : string) {
  const d1 = new Date(date1);
  const d2 = new Date();

  const years = d2.getFullYear() - d1.getFullYear();
  const months = d2.getMonth() - d1.getMonth();
  return years * 12 + months;
}
function sendEmail(agentEmail: string, ListingId : string) {

  const nameElement = window.document.getElementById('name') as HTMLInputElement | null;
  const name = nameElement ? encodeURIComponent(nameElement.value) : '';

  const messageElement = document.getElementById('message') as HTMLTextAreaElement | null;
  const message = messageElement ? encodeURIComponent(messageElement.value) : '';

  const subject = encodeURIComponent("Property Enquiry");
   const body = encodeURIComponent(
    `Name: ${name}\n ListingId: ${ListingId} \n Message: ${message}`
  );

  const mailtoLink = `mailto:${agentEmail}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
}
   
  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
    try {
       const res = await axios.get(`/api/property-details/${id}`);
      setProperty(res.data);
    } catch (error) {
       console.error(error);
    } finally{
     setLoading(false);
    }
  }
  fetchProperty();

  }, [id]);


  return (
    <>
    { loading ?
      <div style={{
      display: "flex",
      background:'#2d3243',
      justifyContent: "center",
      alignItems: "center",
      height: "100px",// full viewport height for vertical centering
    }}>
      <ClipLoader size={50} color="#e6f1c6" />
    </div>
      :
      <>
    <div className="bg-[#f8fafc] min-h-screen py-8 px-2">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Content */}
           <section className="lg:col-span-2 flex flex-col gap-4">
             {/* Title & Gallery */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="hidden font-bold text-black text-2xl"> Title </div>
               <div className="flex items-center gap-2 text-gray-500 mt-1">
                 <FaMapMarkerAlt />
                 <span>{property.UnparsedAddress}</span>
               </div>
                <Swiper
                        modules={[Navigation]}
                        navigation={true}
                        spaceBetween={10}
                        slidesPerView={1}
                       className="w-full h-full"
                     >
                       {property.parsedMedia.map((slide: string, idx: number) => (
                         <SwiperSlide key={idx}>

                             <Image
                               src={slide}
                               alt={`Slide ${idx + 1}`}
                              width={800}
                              height={400}
                              loading='lazy'
                              style={{ borderRadius: '20px', maxWidth: "100%", maxHeight: "400px" }}
                              className="mt-5 object-cover border" />
                         </SwiperSlide>
                       ))}
                     </Swiper>
            
               {/* Ratings or location info row can be added here */}
             </div>
   
             {/* Description */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <p className="text-gray-700">{property.PublicRemarks}</p>
              
             </div>
   
             {/* Overview Section */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-4">Overview</div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">                  
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaMapMarkerAlt />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Listing ID</div>
                       <div className="font-semibold text-[#2d3243]">#{property.ListingKey}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaBed />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Type</div>
                       <div className="font-semibold text-[#2d3243]">Residential</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaCalendarAlt />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Build Year</div>
                       <div className="font-semibold text-[#2d3243]">{property.YearBuilt}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaBed />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Bed</div>
                       <div className="font-semibold text-[#2d3243]">{property.BedroomsTotal}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaBath />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Bath</div>
                       <div className="font-semibold text-[#2d3243]">{property.BathroomsTotalInteger}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-4">
                     <span className="p-2 bg-[#e6f1c6] rounded-full text-[#2d3243]">
                      <FaRulerCombined />
                     </span>
                     <div>
                       <div className="text-xs text-gray-400 font-medium">Size</div>
                       <div className="font-semibold text-[#2d3243]">{property.LivingArea} sqft</div>
                     </div>
                   </div>  
               </div>
             </div>
   
             {/* Features & Amenities Section */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-4">Features & Amenities</div>
               <div className="flex flex-wrap gap-3">
                 { property.parsedAssociationAmenities.length > 0 ?
                   property.parsedAssociationAmenities.map((amenity: string, idx: number) => (
                   <span key={idx} className="px-3 py-1 bg-[#e6f1c6] rounded-full text-[#2d3243] text-sm font-medium">
                     {amenity}
                   </span>
                 )):<><span className="px-3 py-1 bg-[#e6f1c6] rounded-full text-[#2d3243] text-sm font-medium">NA</span></>}
               </div>
             </div>
   
             {/* Location / Map Section */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-4">Location</div>
               <div className="rounded-lg overflow-hidden border">
                 <iframe
                   src="https://www.openstreetmap.org/export/embed.html?bbox=-73.95%2C40.67%2C-73.93%2C40.69&layer=mapnik"
                   width="100%"
                   height="300"
                   className="border-none"
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Map"
                 />
               </div>
               <div className="mt-3 flex items-center gap-2 text-gray-500">
                 <FaMapMarkerAlt />
                 <span>{property.UnparsedAddress}</span>
                 <a
                   href={`https://maps.google.com/?q=${encodeURIComponent(property.UnparsedAddress)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="ml-auto px-3 py-1 bg-[#e6f1c6] rounded-full text-[#2d3243] text-sm font-semibold hover:bg-[#d6eeb4]"
                 >
                   Get Directions
                 </a>
               </div>
             </div>
           </section>
   
           {/* Sidebar */}
           <aside className="flex flex-col gap-6">
             {/* Author Info */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-2">Client Info</div>
               <div className="flex items-center gap-3 mb-3">
                 <Image src="/avatar.jpg" alt="client avatar" width={30} height={30} className="rounded-full object-cover" />
                 <div className="font-semibold text-[#2d3243]">{property.ListAgentFullName}</div>
               </div>
               <div className="text-xs text-gray-500 mb-2">Member since {diffInMonths(property.ListingContractDate)} months ago</div>
               
             </div>
   
             {/* Property Contact */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-2">Client Contact</div>
               <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlinePhone /> {property.ListAgentOfficePhone? property.ListAgentOfficePhone: 'NA' }</div>
               {property.ListAgentEmail.split(';').length == 1 ?
              <>
               <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlineMail /> {property.ListAgentEmail? property.ListAgentEmail : 'NA'}</div>
               </>
               :
               <>
                  <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlineMail /> {property.ListAgentEmail? property.ListAgentEmail.split(';')[0] : 'NA'}</div>
                  <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlineMail /> {property.ListAgentEmail? property.ListAgentEmail.split(';')[1] : 'NA'}</div>
               </>
               }
               {property.ListOfficeURL?
               <>
               <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlineLink /> <a href={property.ListOfficeURL} target="_blank" className="underline text-[#2d3243]">{property.ListOfficeURL}</a></div>
               </>
               :
               <></>
              }
             </div>
   
             {/* Contact Listing Owner */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-2">Contact Listing Agent</div>
               <form action={"mailto:"+property.ListAgentEmail} method="GET" encType="text/plain" className="flex flex-col gap-3">
                 <input
                   className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-[#e6f1c6]"
                   type="text"
                   placeholder="Name"
                   id="name"
                 />
                 
                 <textarea
                   className="border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring focus:border-[#e6f1c6]"
                   placeholder="Message..."
                   id="message"
                 />
                 <button
                 type="button"
                   className="px-4 py-2 rounded-lg bg-[#e6f1c6] text-[#2d3243] font-semibold hover:bg-[#d6eeb4]"
                   onClick={ () => sendEmail(property.ListAgentEmail, property.ListingKey)}
                 >
                   Submit Now
                 </button>
               </form>
             </div>
           </aside>
         </div>
    </div>
    </>
    }
    </>
  );
}