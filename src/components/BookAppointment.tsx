import React from 'react';

function sendEmail(agentEmail: string) {

  const subjectElement = document.getElementById('subject') as HTMLTextAreaElement | null;
  const sub = subjectElement ? encodeURIComponent(subjectElement.value) : '';

  const nameElement = window.document.getElementById('name') as HTMLInputElement | null;
  const name = nameElement ? encodeURIComponent(nameElement.value) : '';

  const numberElement = window.document.getElementById('number') as HTMLInputElement | null;
  const number = numberElement ? encodeURIComponent(numberElement.value) : '';

  const messageElement = document.getElementById('message') as HTMLTextAreaElement | null;
  const message = messageElement ? encodeURIComponent(messageElement.value) : '';

  const subject = encodeURIComponent(sub);
   const body = encodeURIComponent(
    `Name: ${name}\n Mobile: ${number} \n Message: ${message}`
  );

  const mailtoLink = `mailto:${agentEmail}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
}


const BookAppointment: React.FC = () => (

  
  <div className="bg-white pb-10 w-full">

    {/* Contact Form */}
    <div className="container mx-auto py-6">
      <div className="text-center text-[#00bfa6] font-semibold mb-1">Book Appointment</div>
      <h1 className="text-5xl font-bold text-center mb-4 text-[#16243e]">Send Message Anytime</h1>
      <form className="bg-white mx-auto max-w-4xl rounded p-6 shadow flex flex-col gap-4">
        <div className="flex gap-2">
          <input className="contect-form text-[#000] flex-1 border rounded p-2" type="text" id="name" placeholder="Your Name" required />
          <input className="contect-form text-[#000] flex-1 border rounded p-2" type="text" id="number" placeholder="Phone Number" required />
        </div>
        <div className="flex gap-2">
          <input className="contect-form text-[#000] flex-1 border rounded p-2" type="email" placeholder="Email Address" required />
          <input className="contect-form text-[#000] flex-1 border rounded p-2" type="text" id="subject" placeholder="Subject" />
        </div>
        <textarea className="contect-form text-[#000] border rounded p-2 min-h-[120px]" id="message" placeholder="Write a Message" required />
        <button  onClick={ () => sendEmail('info@obrglobal.com')} className="bg-[#00bfa6] text-white rounded-4xl cursor-pointer py-2 font-bold mt-2 mx-auto h-15 w-60">
          Send a Message
        </button>
      </form>
    </div>
  </div>
);

export default BookAppointment;
