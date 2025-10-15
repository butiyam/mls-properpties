import React from 'react';
const BookAppointment: React.FC = () => (
  <div className="bg-white pb-10 w-full">

    {/* Contact Form */}
    <div className="container mx-auto py-6">
      <div className="text-center text-[#00bfa6] font-semibold mb-1">Book Appointment</div>
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

export default BookAppointment;
