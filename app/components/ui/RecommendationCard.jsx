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
      <Link href={`/listings/${listing.id}`} className="bloc h-full" onClick={handleCardClick}>
        <div className=" hover:shadow-sm transition-all duration-200 group flex flex-row items-center p-2 gap-3  ">
          
          {/* Media Frame wrapper */}
          <div className="relative w-full h-30 bg-slate-100 rounded-lg overflow-hidden shrink-0">
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

         

       

        </div>
         <div className="flex justify-center items-center gap-1.5 text-[12px] font-medium text-slate-700">
                <span className=" tracking-wider ">
                  {listing.category || 'General'}
                </span>
              
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