'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Smartphone, 
  Car, 
  Shirt, 
  Home, 
  Laptop, 
  Heart, 
  Briefcase, 
  Wrench, 
  Package,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function RecentListingCard({ listing }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasImages = listing.image && listing.image !== '';
  const imageCount = listing.images?.length || 0;
  const totalImages = hasImages || imageCount > 0 ? Math.max(1, imageCount) : 0;
  
  const handlePrevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const getCurrentImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      const currentImage = listing.images[currentImageIndex];
      return typeof currentImage === 'object' ? currentImage?.url : currentImage;
    }
    return listing.image || '';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Phones: <Smartphone size={22} />,
      Cars: <Car size={22} />,
      Fashion: <Shirt size={22} />,
      Properties: <Home size={22} />,
      Electronics: <Laptop size={22} />,
      Personals: <Heart size={22} />,
      Jobs: <Briefcase size={22} />,
      Services: <Wrench size={22} />,
    };
    return icons[category] || <Package size={22} />;
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-xl p-3.5 flex gap-4 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
        
        {/* Left Side: Image Gallery Container */}
        <div className="relative w-24 h-24 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden group-hover:border-sky-200 transition-colors duration-200">
          {totalImages > 0 && getCurrentImageUrl() ? (
            <>
              <Image 
                src={getCurrentImageUrl()} 
                alt={listing.title}
                fill
                className="object-cover"
              />
              
              {/* Image Counter Badge */}
              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                {currentImageIndex + 1}/{totalImages}
              </div>

              {/* Navigation Buttons (visible on hover or if multiple images) */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft size={14} className="text-slate-900" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight size={14} className="text-slate-900" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center text-slate-500">
              {getCategoryIcon(listing.category)}
            </div>
          )}
        </div>
        
        {/* Right Side: Content Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              {/* Title */}
              <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 flex-1 group-hover:text-sky-600 transition-colors duration-150">
                {listing.title}
              </h3>
              {/* Sky Blue Price */}
              <span className="text-sky-600 font-extrabold text-sm sm:text-base whitespace-nowrap">
                {formatPrice(listing.price)}
              </span>
            </div>
            
            {/* Location with micro icon */}
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
              {listing.category}
            </span>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Clock size={11} className="shrink-0" />
              {listing.timeAgo}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}