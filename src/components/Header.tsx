import { useState } from 'react';
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#1A1F2B] flex items-center justify-between px-4 py-3 relative">
      {/* Logo and name */}
      <div className="flex items-center gap-3">
        <Link href="/">
        <Image
          src="/logo.png"
          alt="Oak Brook Realty"
          width={100}
          height={100}
          className="object-cover rounded"
        />
        </Link>
      </div>
      {/* Desktop Navigation */}
      <nav className="flex-1 justify-center hidden md:flex">
        <ul className="flex gap-8 text-white text-lg font-semibold">
          <li className="hover:text-teal-200">
            <Link href="http://obrglobal.com/">Home</Link>
          </li>
          <li className="hover:text-teal-200">
             <Link href="/contact-us">Contact Us</Link>
          </li>
          <li className="hover:text-teal-200">
            <Link href="/view-properties">View Properties</Link>
          </li>
        </ul>
      </nav>
      {/* View Properties Button Desktop */}
      <div className="hidden md:flex">
        <Link
          href="/properties"
          className="flex items-center px-6 py-2 border border-[#e6f1c6] rounded-full text-[#e6f1c6] text-lg font-bold hover:bg-[#31374a] transition"
        >
          <FaHome className="mr-2" />
          Properties
        </Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-white text-2xl ml-auto"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* Mobile Nav Drawer */}
      <div className={`absolute top-full left-0 w-full bg-[#2d3243] border-t border-gray-700 z-50 md:hidden transition-all ${menuOpen ? "block" : "hidden"}`}>
        <nav>
          <ul className="flex flex-col items-center gap-6 py-6 text-white text-lg font-semibold">
            <li>
              <Link href="http://obrglobal.com/" className="hover:text-teal-200" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="hover:text-teal-200">
             <Link href="/contact-us">
             Contact Us
             </Link>
            </li>
            <li>
              <Link href="/view-properties" className="hover:text-teal-200" onClick={() => setMenuOpen(false)}>
              View Properties
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="flex items-center px-6 py-2 border border-[#e6f1c6] rounded-full text-[#e6f1c6] font-bold hover:bg-[#31374a] transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome className="mr-2" />
                Properties
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
