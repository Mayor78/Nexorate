'use client';

import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 16, interactive = false, onChange, className = '' }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-slate-300'
            }
          />
        </button>
      ))}
    </div>
  );
}
