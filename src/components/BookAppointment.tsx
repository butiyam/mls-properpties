import React, { useRef } from 'react';

const BookAppointment: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function sendEmail(e: React.FormEvent<HTMLFormElement>, agentEmail: string) {
    e.preventDefault();

    const name = nameRef.current?.value || '';
    const number = numberRef.current?.value || '';
    const subject = subjectRef.current?.value || '';
    const message = messageRef.current?.value || '';

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nMobile: ${number}\nMessage: ${message}`
    );

    const mailtoLink = `mailto:${agentEmail}?subject=${mailSubject}&body=${mailBody}`;

    window.location.href = mailtoLink;
  }

  return (
    <div className="bg-white pb-10 w-full">
      <div className="container mx-auto py-6 px-4">
        <div className="text-center text-[#00bfa6] font-semibold mb-1">Book Appointment</div>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#16243e]">Send Message Anytime</h1>

        <form
          onSubmit={(e) => sendEmail(e, 'info@obrglobal.com')}
          className="bg-white mx-auto max-w-5xl rounded-lg p-4 shadow flex flex-col gap-4"
        >
          {/* Inputs group 1 */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              ref={nameRef}
              className="contect-form text-[#000] flex-1 border rounded px-4 py-3"
              type="text"
              placeholder="Your Name"
              required
            />
            <input
              ref={numberRef}
              className="contect-form text-[#000] flex-1 border rounded px-4 py-3"
              type="text"
              placeholder="Phone Number"
              required
            />
          </div>

          {/* Inputs group 2 */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              className="contect-form text-[#000] flex-1 border rounded px-4 py-3"
              type="email"
              placeholder="Email Address"
              required
            />
            <textarea
              ref={subjectRef}
              className="contect-form text-[#000] flex-1 border rounded px-4 py-3 resize-none"
              placeholder="Subject"
              rows={1}
            />
          </div>

          <textarea
            ref={messageRef}
            className="contect-form text-[#000] border rounded px-4 py-3 min-h-[120px] resize-none"
            placeholder="Write a Message"
            required
          />

          <button
            type="submit"
            className="bg-[#00bfa6] text-white rounded-full cursor-pointer py-3 font-bold mx-auto w-56 hover:bg-[#009f8f] transition-colors duration-200"
          >
            Send a Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
