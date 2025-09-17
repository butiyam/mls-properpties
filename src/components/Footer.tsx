import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFax, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
const galleryImages = [
  "/gallery1.png", // Replace with actual image URLs or import statements
  "/gallery2.png",
  "/gallery3.png",
  "/gallery4.png",
  "/gallery5.png",
  "/gallery6.png",
];

export default function Footer() {
  return (
    <footer className="bg-[#2d3243] text-white pt-8">
      {/* Contact Bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="bg-[#1fe6e6] rounded-2xl flex flex-wrap justify-between items-center p-6 gap-6 md:gap-0 shadow-md">
          {/* Address */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="bg-[#26fff9] p-3 rounded-full text-white"><FaMapMarkerAlt size={22} /></div>
            <div>
              <div className="font-semibold">Address</div>
              <div className="text-sm text-white">7 N. Grant Street Suite LL<br />Hinsdale, IL 60521</div>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="bg-[#26fff9] p-3 rounded-full text-white"><FaEnvelope size={22} /></div>
            <div>
              <div className="font-semibold">Send Email</div>
              <div className="text-sm text-white">info@obrglobal.com</div>
            </div>
          </div>
          {/* Call */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <div className="bg-[#26fff9] p-3 rounded-full text-white"><FaPhoneAlt size={22} /></div>
            <div>
              <div className="font-semibold">Call Today</div>
              <div className="text-sm text-white">(630) 242-5662</div>
            </div>
          </div>
          {/* Fax */}
          <div className="flex items-center gap-2 min-w-[160px]">
            <div className="bg-[#26fff9] p-3 rounded-full text-white"><FaFax size={22} /></div>
            <div>
              <div className="font-semibold">Fax</div>
              <div className="text-sm text-white">(312) 291-4258</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 items-start">
        {/* Company & Social */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Image src="/logo-footer.png" alt="Company Logo" />
            <p className="mb-4 text-gray-200">Discover timeless elegance, world-class design, and unmatched locations.<br />
              Your next extraordinary home awaits.</p>
            <div className="flex gap-5 justify-center md:justify-start mb-4">
              <span>Follow on</span>
              <a href="#"><FaFacebookF className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaTwitter className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaLinkedinIn className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaInstagram className="hover:text-[#1fe6e6]" /></a>
            </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold mb-2 border-b-2 border-[#1fe6e6] w-fit">Quick Links</h4>
          <ul className="space-y-3 text-[#1fe6e6] text-base mt-2 font-semibold">
            <li>
              <Link href="/" className="flex items-center gap-2">
              &raquo; <span className="text-white hover:text-[#1fe6e6]">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/properties" className="flex items-center gap-2">
              &raquo; <span className="text-white hover:text-[#1fe6e6]">Available Properties</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* Gallery */}
        <div>
          <h4 className="text-lg font-semibold mb-2 border-b-2 border-[#1fe6e6] w-fit">Gallery</h4>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryImages.slice(0,6).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Property ${idx+1}`}
                className="w-full h-20 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 py-4 text-center text-gray-400 text-sm">
        &copy; 2025 Oak Brook Realty. Designed By Samak Solutions
      </div>
    </footer>
  );
}
