'use client';

import { useState, useEffect } from 'react';
import { X, Star, Loader2, CheckCircle } from 'lucide-react';
import { submitReview, hasUserReviewed } from '../../lib/reviews';
import { useToast } from '../../context/ToastContext';

export default function RateSellerModal({ isOpen, onClose, seller, listingId, user }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (user && listingId) {
        hasUserReviewed(user.uid, listingId).then(setAlreadyReviewed);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, user, listingId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      showError('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      const result = await submitReview({
        sellerId: seller.id || seller.sellerId,
        reviewerId: user.uid,
        reviewerName: user.displayName || 'Anonymous',
        listingId,
        rating,
        comment,
      });
      if (result.success) {
        setSuccess(true);
        showSuccess('Review submitted successfully!');
        setTimeout(() => { setSuccess(false); onClose(); }, 2000);
      } else {
        showError(result.error || 'Failed to submit review');
      }
    } catch {
      showError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-slideUp" style={{ maxHeight: 'calc(100vh - 32px)' }}>
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="w-8" />
          <h2 className="text-base font-black text-slate-900">Rate Seller</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5">
          {alreadyReviewed ? (
            <div className="text-center py-8">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900">Already Reviewed</h3>
              <p className="text-sm text-slate-500 mt-1">You have already rated this seller for this listing.</p>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900">Thank You!</h3>
              <p className="text-sm text-slate-500 mt-1">Your review helps the community.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 text-center mb-5">
                How was your experience with <span className="font-bold">{seller.name || seller.displayName || 'this seller'}</span>?
              </p>

              <div className="flex justify-center gap-1.5 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={36}
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-slate-300'}
                    />
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 mb-2">Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
