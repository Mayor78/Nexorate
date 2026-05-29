'use client';

import { useRouter } from 'next/navigation';
import { Laptop, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import SearchBar from '../ui/SearchBar';

export default function HeroSection() {
  const router = useRouter();

  const handleSearch = ({ searchQuery, location }) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    router.push(`/categories?${params.toString()}`);
  };

  return (
    <div className="relative bg-slate-950 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Sleek Tagline Badge */}
        <div className="inline-flex items-center bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full mb-6">
          <span className="text-xs tracking-widest font-bold uppercase text-sky-400">
            BUY • SELL • SWAP
          </span>
        </div>

        {/* Flat, Bold Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5 max-w-3xl leading-[1.15]">
          Free Premium Classifieds Ads and <br className="hidden sm:block" /> Seamless Connection Platform
        </h1>
        
        {/* Sharp, readable description */}
        <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Nexorate is Africa's premium classifieds and personals marketplace built to help people buy, sell, swap gadgets, and connect effortlessly.
        </p>
        
        {/* Reusable Search Bar */}
        <SearchBar onSearch={handleSearch} />

      

       

      </div>
    </div>
  );
}