import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFax } from "react-icons/fa";
// Example dummy team data
const team = [
  {
    name: 'Thomas Chiramel',
    title: 'Managing Broker',
    bio: 'Thomas Chiramel has proudly served as the Managing Broker for over 20 years, dedicated to guiding clients... delivering exceptional results.',
    image: '/thomas.jpg', // replace with your image path or use placeholder
  },
  {
    name: 'Ranesh Phillips',
    title: 'Broker',
    bio: 'Passionate about luxury real estate... Ranesh specializes in high-end properties and is committed to providing clients with personalized service.',
    image: '/ranesh.jpg', // replace with your image path or use placeholder
  },
];

const contactOptions = [
  {
    icon: <FaMapMarkerAlt/>,
    label: 'Our Address',
    value: '7 N. Grant Street Suite LL Hinsdale, IL 60521',
  },
  {
    icon: <FaEnvelope/>,
    label: 'Email',
    value: 'info@obrglobal.com',
  },
  {
    icon: <FaPhoneAlt/>,
    label: 'Phone',
    value: '(630) 242-5662',
  },
  {
    icon: <FaFax/>,
    label: 'Fax',
    value: '(312) 291-4258',
  },
];

const ContactPage: React.FC = () => (
  <div className="bg-white min-h-screen w-full">
 

<div className="relative h-100 w-full bg-[#1a1f2b] flex items-center justify-center">
  <img src="/header-image.jpg" alt="Banner" className="absolute w-full h-100 object-cover p-5 rounded-4xl" />
  <div className="relative z-10 flex flex-col items-center justify-center w-full">
    <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Contact</h1>
    <div className="text-center">
      <span className="text-white border border-[#ffffff2e] px-4 py-1 rounded-2xl">
        <a href="http://obrglobal.com/" >Home</a> / 
        <span className='text-[#00bfa6]'>Contact</span>
        </span>
    </div>
  </div>
</div>


    {/* Team Section */}
    <div className="container mx-auto py-10 flex flex-col md:flex-row justify-around gap-10 items-center">
      {team.map((member) => (
        <div key={member.name} className="text-center flex flex-col items-center">
          <img src={member.image} alt={member.name} className="w-40 h-40 rounded-full mb-4 object-cover bg-gray-200" />
          <div className="text-xl font-semibold text-[#1f3849] mb-1">{member.name}</div>
          <div className="text-md font-medium text-[#00bfa6] mb-2">{member.title}</div>
          <div className="text-sm text-gray-600 max-w-md">{member.bio}</div>
        </div>
      ))}
    </div>

    {/* Contact Options */}
    <div className="container mx-auto mb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-around">
        {contactOptions.map((option) => (
          <div key={option.label} className="bg-white rounded shadow p-6 text-center flex flex-col items-center">
            <div className="bg-[#03BFA6] p-3 rounded-xl text-white">{option.icon}</div>
            <div className="font-semibold mb-2 text-[#16243e]">{option.label}</div>
            <div className="text-gray-600">{option.value}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Contact Form */}
    <div className="container mx-auto py-6">
      <div className="text-center text-[#00bfa6] font-semibold mb-1">Get In Touch</div>
      <h1 className="text-5xl font-bold text-center mb-4 text-[#16243e]">Send Message Anytime</h1>
      <form className="bg-white mx-auto max-w-4xl rounded p-6 shadow flex flex-col gap-4">
        <div className="flex gap-2">
          <input className="contect-form flex-1 border rounded p-2" type="text" placeholder="Your Name" required />
          <input className="contect-form flex-1 border rounded p-2" type="text" placeholder="Phone Number" required />
        </div>
        <div className="flex gap-2">
          <input className="contect-form flex-1 border rounded p-2" type="email" placeholder="Email Address" required />
          <input className="contect-form flex-1 border rounded p-2" type="text" placeholder="Subject" />
        </div>
        <textarea className="contect-form border rounded p-2 min-h-[120px]" placeholder="Write a Message" required />
        <button className="bg-[#00bfa6] text-white rounded-4xl cursor-pointer py-2 font-bold mt-2 mx-auto h-15 w-60">
          Send a Message
        </button>
      </form>
    </div>
  </div>
);

export default ContactPage;
