import { useState } from 'react';
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2d3243] flex items-center justify-between px-4 py-3 relative">
      {/* Logo and name */}
      <div className="flex items-center gap-3">
        <Link href="/">
        <Image
          src="/logo.jpeg"
          alt="Oak Brook Realty"
          width={60}
          height={60}
          className="object-cover rounded"
        />
        </Link>
        <div className="text-white font-bold text-base leading-tight">
          Oak Brook<br />
          Realty
        </div>
      </div>
      {/* Desktop Navigation */}
      <nav className="flex-1 justify-center hidden md:flex">
        <ul className="flex gap-8 text-white text-lg font-semibold">
          <li className="hover:text-teal-200">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-teal-200">
            <Link href="/properties">Available Properties</Link>
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
          View Properties
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
              <Link href="/" className="hover:text-teal-200" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/properties" className="hover:text-teal-200" onClick={() => setMenuOpen(false)}>
              Available Properties
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="flex items-center px-6 py-2 border border-[#e6f1c6] rounded-full text-[#e6f1c6] font-bold hover:bg-[#31374a] transition"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome className="mr-2" />
                View Properties
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
