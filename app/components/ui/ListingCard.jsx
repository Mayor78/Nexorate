'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function ListingCard({ listing }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const imageCount = listing.images?.length || 0;
  const totalImages = imageCount > 0 ? imageCount : 0;

  const handlePrevImage = (e) => {
    e.preventDefault();
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  const getCurrentImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      const currentImage = listing.images[currentImageIndex];
      return typeof currentImage === 'object' ? currentImage?.url : currentImage;
    }
    return listing.image || '';
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 group h-full flex flex-col">
        
        {/* Image Container */}
        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
          {totalImages > 0 && getCurrentImageUrl() ? (
            <>
              <Image 
                src={getCurrentImageUrl()} 
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Boosted Badge */}
              {listing.isBoosted && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap size={12} /> BOOSTED
                </div>
              )}

              {/* Image Counter Badge */}
              {totalImages > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {currentImageIndex + 1}/{totalImages}
                </div>
              )}

              {/* Navigation Buttons */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft size={16} className="text-slate-900" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight size={16} className="text-slate-900" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-600 transition-colors duration-150">
            {listing.title}
          </h3>

          {/* Price */}
          <p className="text-sky-600 font-extrabold text-lg mt-2">
            {formatPrice(listing.price)}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{listing.location || 'Not specified'}</span>
          </div>

          {/* Category & Seller Info */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-1 rounded">
              {listing.category || 'General'}
            </span>
            {listing.views && (
              <span className="text-xs text-slate-400">
                {listing.views} views
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}