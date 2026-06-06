'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) params.set('location', location.trim());
    router.push(`/categories${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const categories = [
    { name: 'Phones', icon: '📱' },
    { name: 'Cars', icon: '🚗' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Properties', icon: '🏠' },
    { name: 'Services', icon: '🔧' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08),transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs tracking-widest font-bold uppercase text-sky-300">
            Buy &bull; Sell &bull; Connect
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5 max-w-3xl leading-[1.1]">
          Find Anything in{' '}
          <span className="bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">
            Nigeria
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
          Africa&apos;s fastest growing marketplace. Buy, sell, swap gadgets, and connect seamlessly with verified buyers and sellers.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:bg-white/15 transition"
              />
            </div>
            <div className="relative sm:w-48">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:bg-white/15 transition"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-400 transition shadow-lg shadow-sky-500/25"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 mr-1">Popular:</span>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => router.push(`/categories/${cat.name.toLowerCase()}`)}
              className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 hover:text-white transition"
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
