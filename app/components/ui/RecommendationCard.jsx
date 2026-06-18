'use client';

import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from './LoginPrompt';
import { formatPrice } from '../../lib/formatters';
import { trackListingEvent } from '../../lib/analytics';

function RecommendationCard({ listing }) {
  const { user, toggleSaveListing, isListingSaved } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isSaved = isListingSaved?.(listing.id) || false;

  const handleCardClick = () => {
    trackListingEvent(listing.id, 'click', { title: listing.title }).catch(() => {});
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsSaving(true);
    await toggleSaveListing(listing.id, listing);
    setIsSaving(false);
  };

  const getImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      const firstImage = listing.images[0];
      return typeof firstImage === 'object' ? firstImage?.url : firstImage;
    }
    return listing.image || '';
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <Link href={`/listings/${listing.id}`} className="block h-full" onClick={handleCardClick}>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group flex flex-row items-center p-2 gap-3 w-full max-w-[340px] h-[104px]">
          
          {/* Media Frame wrapper */}
          <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
            {imageUrl && !imgError ? (
              <Image 
                src={imageUrl} 
                alt={listing.title}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-102 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <span className="text-xl">📦</span>
              </div>
            )}

            {/* Premium Indicator Overlay Badge */}
            {listing.isBoosted && (
              <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                <Zap size={8} className="fill-white" />
              </div>
            )}
          </div>

          {/* Core Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full py-1 justify-between">
            <div className="space-y-0.5">
              {/* Context Tag Header */}
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <span className="uppercase tracking-wider truncate max-w-[70px]">
                  {listing.category || 'General'}
                </span>
              
              </div>

              {/* Title */}
              <h3 className="font-medium text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-slate-900 transition-colors pr-6">
                {listing.title}
              </h3>
            </div>

            {/* Bottom Row Meta Metrics */}
            <div className="flex items-baseline justify-between gap-2 mt-auto">
          
              
              <div className="flex items-center gap-1 text-[10px] text-slate-400 min-w-0 max-w-[90px]">
                <MapPin size={10} className="shrink-0 text-slate-300" />
                <span className="truncate">{listing.location || 'Remote'}</span>
              </div>
            </div>
          </div>

          {/* Floating Action Menu Button Block */}
          <div className="self-start pt-1">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="p-1.5 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-400 active:scale-95 transition"
              aria-label={isSaved ? "Remove from saved" : "Save listing"}
            >
              <Heart 
                size={14} 
                className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'} 
              />
            </button>
          </div>

        </div>
      </Link>

      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        action="save this listing"
        productName={listing.title}
      />
    </>
  );
}

export default React.memo(RecommendationCard, (prevProps, nextProps) => {
  return prevProps.listing.id === nextProps.listing.id;
});