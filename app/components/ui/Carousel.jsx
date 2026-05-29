'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ children, title, seeAllLink }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [children]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="relative group/carousel py-1">
      {/* Premium Micro Header */}
      <div className="flex items-end justify-between mb-2.5 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xs md:text-sm font-black tracking-wider text-slate-400 uppercase">
            {title}
          </h2>
        </div>
        {seeAllLink && (
          <a 
            href={seeAllLink} 
            className="text-[10px] font-black text-sky-600 hover:text-sky-500 uppercase tracking-widest transition"
          >
            See All →
          </a>
        )}
      </div>

      {/* Slider Ribbon Viewport */}
      <div className="relative">
        
        {/* Left Arrow Trigger */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 border border-slate-200/80 p-1.5 rounded-lg shadow-sm md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-150 text-slate-700"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        {/* Micro-Sized Carousel Track 
            Enforces strict ultra-small element widths.
            Injects nested CSS targeting parameters to hide any price labels, views, or locations inside your children cards. */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex overflow-x-auto gap-2.5 px-4 md:px-6 scroll-smooth scrollbar-none select-none
            [&>*]:w-[110px] sm:[&>*]:w-[130px] [&>*]:shrink-0 [&>*]:h-auto
            [&_p]:hidden [&_span]:hidden [&_h3]:text-[11px] [&_h3]:mt-1 [&_h3]:line-clamp-1 [&_h3]:block"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {/* Right Arrow Trigger */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 border border-slate-200/80 p-1.5 rounded-lg shadow-sm md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-150 text-slate-700"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}