'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PRODUCT_CARDS = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=380&fit=crop',
    label: '@watches',
    rotate: '-rotate-[14deg]',
    translate: '-translate-x-[170px] translate-y-[20px]',
    zIndex: 'z-10',
    shadow: 'shadow-xl',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=380&fit=crop',
    label: '@beauty',
    rotate: '-rotate-[6deg]',
    translate: '-translate-x-[85px] -translate-y-[10px]',
    zIndex: 'z-20',
    shadow: 'shadow-2xl',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=380&fit=crop',
    label: '@sneakers',
    rotate: 'rotate-[2deg]',
    translate: 'translate-x-0 translate-y-[5px]',
    zIndex: 'z-30',
    shadow: 'shadow-2xl',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=380&fit=crop',
    label: '@phones',
    rotate: 'rotate-[7deg]',
    translate: 'translate-x-[85px] -translate-y-[5px]',
    zIndex: 'z-20',
    shadow: 'shadow-xl',
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=380&fit=crop',
    label: '@laptops',
    rotate: 'rotate-[15deg]',
    translate: 'translate-x-[170px] translate-y-[25px]',
    zIndex: 'z-10',
    shadow: 'shadow-lg',
  },
];

const CATEGORIES = [
  { name: 'Phones', icon: '📱' },
  { name: 'Cars', icon: '🚗' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Properties', icon: '🏠' },
  { name: 'Services', icon: '🔧' },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    router.push(`/categories${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative bg-[#F7F7F5] min-h-screen overflow-hidden flex flex-col">

   

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-10 pb-0 flex-1">

        {/* Headline */}
        <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-black leading-[1.05] tracking-tight text-gray-900 max-w-3xl">
          A place to buy, sell,<br />
          <span className="text-gray-400">or promote your service.</span>
        </h1>

        {/* Sub */}
        <p className="mt-4 text-[15px] text-gray-500 max-w-md leading-relaxed">
          Buyers discover what they need. Sellers reach real customers.
          Everyone connects on <strong className="text-gray-700 font-semibold">NEXORATE</strong>.
        </p>

        {/* CTA row */}
        <div className="mt-7 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push('/post')}
            className="px-6 py-3 rounded-full bg-gray-900 text-white text-[14px] font-bold hover:bg-gray-700 transition shadow-md"
          >
            Start selling — it&apos;s free
          </button>
          <button
            onClick={() => router.push('/categories')}
            className="px-6 py-3 rounded-full bg-white border border-gray-200 text-[14px] font-semibold text-gray-700 hover:border-gray-400 transition"
          >
            Browse listings
          </button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-6 w-full max-w-md">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-400 transition">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phones, cars, fashion…"
              className="flex-1 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 outline-none"
            />
            <button type="submit" className="text-[13px] font-bold text-white bg-gray-900 rounded-full px-4 py-1.5 hover:bg-gray-700 transition">
              Search
            </button>
          </div>
        </form>

       

        {/* ── Fanned product cards ── */}
        <div className="relative mt-2 w-full flex justify-center" style={{ height: '260px' }}>
          {PRODUCT_CARDS.map((card) => (
            <div
              key={card.id}
              className={`
                absolute bottom-0
                ${card.rotate} ${card.translate} ${card.zIndex} ${card.shadow}
                rounded-2xl overflow-hidden
                w-[130px] h-[170px]
                md:w-[155px] md:h-[200px]
                hover:scale-105 hover:-translate-y-3 transition-transform duration-300 cursor-pointer
                border border-white/60
              `}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.label}
                className="w-full h-full object-cover"
              />
              {/* badge */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-800 px-2 py-0.5 rounded-full shadow-sm">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F7F5] to-transparent z-20" />
    </section>
  );
}