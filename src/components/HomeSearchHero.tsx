/* eslint-disable @next/next/no-img-element */
import { FaSearch } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useState } from "react";

export default function ResponsiveHomeSearchHero() {
  const [form, setForm] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bed: "",
    bath: "",
  });

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden px-0">
      {/* Background Image */}
      <img
        src="/bg-hero.jpg"
        alt="Home search background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-0 md:pt-8">
        {/* Heading */}
        <h1 className="text-white text-center font-serif font-bold text-4xl md:text-7xl mb-8 md:mb-12 drop-shadow-lg max-w-4xl px-4 md:px-0">
          Find a home<br className="md:hidden" /> in style
        </h1>
        {/* Search Bar */}
        <form className="w-full max-w-5xl md:mx-auto">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex flex-row gap-0 bg-white shadow-lg rounded items-center overflow-hidden">
            <input
              type="text"
              placeholder="Neighborhood, City, ZIP or MLS#"
              className="h-16 px-6 py-3 w-full text-xl outline-none border-none rounded-none bg-white flex-1"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <select
              className="h-16 px-5 py-3 text-lg border-l border-gray-100 outline-none bg-white min-w-[140px]"
              value={form.minPrice}
              onChange={e => setForm({ ...form, minPrice: e.target.value })}
            >
              <option value="">Min Price</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
              <option value="200000">$200,000</option>
            </select>
            <select
              className="h-16 px-5 py-3 text-lg border-l border-gray-100 outline-none bg-white min-w-[140px]"
              value={form.maxPrice}
              onChange={e => setForm({ ...form, maxPrice: e.target.value })}
            >
              <option value="">Max Price</option>
              <option value="200000">$200,000</option>
              <option value="400000">$400,000</option>
              <option value="600000">$600,000</option>
            </select>
            <select
              className="h-16 px-5 py-3 text-lg border-l border-gray-100 outline-none bg-white min-w-[100px]"
              value={form.bed}
              onChange={e => setForm({ ...form, bed: e.target.value })}
            >
              <option value="">Bed</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <select
              className="h-16 px-5 py-3 text-lg border-l border-gray-100 outline-none bg-white min-w-[100px]"
              value={form.bath}
              onChange={e => setForm({ ...form, bath: e.target.value })}
            >
              <option value="">Bath</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 font-semibold bg-[#003385] text-white px-9 py-0 h-16 text-lg hover:bg-[#072868] transition rounded-none"
            >
              <HiOutlineLocationMarker className="text-xl" />
              <FaSearch className="text-2xl" />
              <span className="font-bold pl-2">Search</span>
            </button>
          </div>
          {/* Mobile: stacked layout */}
          <div className="md:hidden flex flex-col gap-3 bg-white rounded shadow-lg px-3 py-4 w-full">
            <div className="flex w-full gap-2 items-center">
              <input
                type="text"
                placeholder="Neighborhood, City, ZIP or MLS#"
                className="flex-1 py-3 px-2 text-lg border border-gray-200 rounded focus:outline-none"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
              <button
                type="button"
                aria-label="Locate"
                className="bg-[#003385] p-3 rounded text-white flex items-center justify-center"
              >
                <HiOutlineLocationMarker />
              </button>
              <button
                type="submit"
                className="bg-[#003385] p-3 rounded text-white flex items-center justify-center"
              >
                <FaSearch />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <select
                className="w-full py-3 px-2 text-lg border border-gray-200 rounded focus:outline-none"
                value={form.minPrice}
                onChange={e => setForm({ ...form, minPrice: e.target.value })}
              >
                <option value="">Min Price</option>
                <option value="50000">$50,000</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
              </select>
              <select
                className="w-full py-3 px-2 text-lg border border-gray-200 rounded focus:outline-none"
                value={form.maxPrice}
                onChange={e => setForm({ ...form, maxPrice: e.target.value })}
              >
                <option value="">Max Price</option>
                <option value="200000">$200,000</option>
                <option value="400000">$400,000</option>
                <option value="600000">$600,000</option>
              </select>
              <select
                className="w-full py-3 px-2 text-lg border border-gray-200 rounded focus:outline-none"
                value={form.bed}
                onChange={e => setForm({ ...form, bed: e.target.value })}
              >
                <option value="">Bed</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select
                className="w-full py-3 px-2 text-lg border border-gray-200 rounded focus:outline-none"
                value={form.bath}
                onChange={e => setForm({ ...form, bath: e.target.value })}
              >
                <option value="">Bath</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
