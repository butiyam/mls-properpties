import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLink } from "react-icons/hi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';


export default function PropertyDetails() {


  // Demo property data (replace with API response)
   const prop = {
     title: "West Square Apartments",
     address: "19 Brooklyn Street, New York",
     image: "/gallery1.png",
     description: "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Praesent varius rutrum nulla ut metus varius laoreet.",
     overview: [
       { label: "Number ID", value: "#9168", icon: <FaMapMarkerAlt /> },
       { label: "Type", value: "Apartment", icon: <FaBed /> },
       { label: "Build Year", value: "2021", icon: <FaCalendarAlt /> },
       { label: "Bed", value: "2", icon: <FaBed /> },
       { label: "Bath", value: "2", icon: <FaBath /> },
       { label: "Size", value: "1850 sqft", icon: <FaRulerCombined /> }
     ],
     amenities: [
       "Air Conditioning", "Washer and dryer", "Swimming Pool", "Basketball", "24/7 Security", "Central Air", "Media Room", "Indoor Game"
     ],
     map: "https://www.openstreetmap.org/export/embed.html?bbox=-73.95%2C40.67%2C-73.93%2C40.69&layer=mapnik", // example embed
     owner: {
       name: "Samakcodez",
       profileUrl: "https://trinityimpact.com",
       avatar: "/avatar.jpg",
     },
     contact: {
       address: "19 Brooklyn Street, New York",
       phone: "+1(666) 888-919",
       email: "contact@example.com",
       website: "https://example.com"
     }
   };

interface ParsedMedia {
  ImageHeight: number;
  ResourceRecordID: string;
  Order: number;
  ImageWidth: number;
  MediaURL: string;
  MediaModificationTimestamp: string;
  MediaKey: string;
}

  const router = useRouter();
  const { id } = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);
 
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
    fetch(`/api/property-details/${id}`)
      .then(res => res.json())
      .then(data => setProperty(data))
      .catch(err => console.error(err));
  }, [id]);


    if (!property) return <div>Loading...</div>;
    if (property) 

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 px-2">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Content */}
           <section className="lg:col-span-2 flex flex-col gap-4">
             {/* Title & Gallery */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-2xl"> Title </div>
               <div className="flex items-center gap-2 text-gray-500 mt-1">
                 <FaMapMarkerAlt />
                 <span>{property.UnparsedAddress}</span>
               </div>
                <Swiper
                       modules={[EffectFade, Autoplay]}
                       effect="fade"
                       autoplay={{ delay: 4500, disableOnInteraction: false }}
                       loop
                       className="w-full h-full"
                     >
                       {property.parsedMedia.map((slide: ParsedMedia, idx: number) => (
                         <SwiperSlide key={idx}>

                             <Image
                               src={slide.MediaURL}
                               alt={`Slide ${idx + 1}`}
                              width={slide.ImageWidth}
                              height={slide.ImageHeight}
                              style={{ borderRadius: '20px', width: "100%", height: "auto" }}
                              className="mt-5 object-cover border" />
                          
                        
                         </SwiperSlide>
                       ))}
                     </Swiper>
            
               {/* Ratings or location info row can be added here */}
             </div>
   
             {/* Description */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <p className="text-gray-700">{property.PublicRemarks}</p>
               <p className="mt-2 text-gray-700">
                 Nullam turpis sem sit amet orci eget eros faucibus tincidunt. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
               </p>
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
                 {property.parsedAssociationAmenities.map((amenity: string, idx: number) => (
                   <span key={idx} className="px-3 py-1 bg-[#e6f1c6] rounded-full text-[#2d3243] text-sm font-medium">
                     {amenity}
                   </span>
                 ))}
               </div>
             </div>
   
             {/* Location / Map Section */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-4">Location</div>
               <div className="rounded-lg overflow-hidden border">
                 <iframe
                   src={prop.map}
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
               <div className="font-bold text-black text-lg mb-2">Agent Info</div>
               <div className="flex items-center gap-3 mb-3">
                 <Image src={prop.owner.avatar} alt={prop.owner.name} width={30} height={30} className="rounded-full object-cover" />
                 <div className="font-semibold text-[#2d3243]">{property.ListAgentFullName}</div>
               </div>
               <div className="text-xs text-gray-500 mb-2">Member since {diffInMonths(property.ListingContractDate)} months ago</div>
               
             </div>
   
             {/* Property Contact */}
             <div className="bg-white rounded-xl shadow-md p-6">
               <div className="font-bold text-black text-lg mb-2">Agent Contact</div>
               <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlinePhone /> {property.ListAgentOfficePhone}</div>
               <div className="mb-2 flex items-center gap-2 text-gray-700"><HiOutlineMail /> {property.ListAgentEmail}</div>
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
  );
}