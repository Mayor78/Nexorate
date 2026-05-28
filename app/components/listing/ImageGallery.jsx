'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Zap } from 'lucide-react';

export default function ImageGallery({ images, title, isBoosted, isLiked, onLike }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Main Image Display */}
      <div className="relative h-80 md:h-96 bg-gray-200">
        {images && images.length > 0 ? (
          <>
            <Image 
              src={images[currentImageIndex]?.url || images[currentImageIndex]} 
              alt={`${title} - Image ${currentImageIndex + 1}`} 
              fill 
              className="object-cover" 
            />
            
            {/* Image Counter Badge */}
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              {currentImageIndex + 1}/{images.length}
            </div>
            
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-200"
                >
                  <ChevronLeft size={20} className="text-slate-900" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-200"
                >
                  <ChevronRight size={20} className="text-slate-900" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-6xl">📦</span>
          </div>
        )}
        {isBoosted && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap size={12} /> BOOSTED
          </div>
        )}
        <button 
          onClick={onLike}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={20} className={isLiked ? 'fill-red-500 text-red-500' : 'text-dark-muted'} />
        </button>
      </div>

      {/* Thumbnail Gallery */}
      {images && images.length > 1 && (
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => {
              const imageUrl = typeof image === 'object' ? image?.url : image;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}