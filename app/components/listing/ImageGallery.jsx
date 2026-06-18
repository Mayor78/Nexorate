'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Zap, X, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images, title, isBoosted, isLiked, onLike }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useState(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
      if (e.key === 'ArrowRight') handleLightboxNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Main Image Display */}
        <div className="relative h-90 md:h-96 bg-gray-200">
          {images && images.length > 0 ? (
            <>
              <div 
                className="cursor-zoom-in relative w-full h-full"
                onClick={() => openLightbox(currentImageIndex)}
              >
                <Image 
                  src={images[currentImageIndex]?.url || images[currentImageIndex]} 
                  alt={`${title} - Image ${currentImageIndex + 1}`} 
                  fill 
                  className="object-cover" 
                />
                {/* Zoom indicator */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                  <span>Click to zoom</span>
                </div>
              </div>
              
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

      {/* Lightbox Modal */}
      {lightboxOpen && images && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition"
          >
            <X size={28} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]?.url || images[lightboxIndex]}
              alt={`${title} - Full size`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft size={32} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight size={32} className="text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}