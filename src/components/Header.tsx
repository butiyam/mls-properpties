import { FaHome } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
export default function Header() {
  return (
    <header className="bg-[#2d3243] flex items-center justify-between px-6 py-3">
      {/* Logo and name */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo.jpeg" // Replace with your logo path
          alt="Oak Brook Realty"
          className="w-24 h-24 object-cover rounded"
        />
        <div className="text-white font-bold text-lg leading-tight">
          Oak Brook<br />
          Realty
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex gap-8 text-white text-lg font-semibold">
          <li className="hover:text-teal-200">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-teal-200">
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
      {/* View Properties Button */}
      <div>
        <a
          href="/properties"
          className="flex items-center px-6 py-2 border border-[#e6f1c6] rounded-full text-[#e6f1c6] text-lg font-bold hover:bg-[#31374a] transition"
        >
          <FaHome className="mr-2" />
          View Properties
        </a>
      </div>
    </header>
  );
}
