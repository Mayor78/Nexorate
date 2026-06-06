'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Eye, Zap } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import ConfirmModal from '../ui/ConfirmModal';

export default function ListingItem({ listing, formatPrice, formatDate, onDelete }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'listings', listing.id));
      onDelete?.();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/post?edit=${listing.id}`);
  };

  const getFormattedDate = () => {
    if (!listing.createdAt) return 'Recently';
    return formatDate(listing.createdAt);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition border border-slate-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{listing.title}</h3>
          <p className="text-sky-600 font-medium">{formatPrice(listing.price)}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{listing.views || 0} views</span>
            <span>&bull;</span>
            <span>Posted {getFormattedDate()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            listing.status === 'active' ? 'bg-green-100 text-green-700' : 
            listing.status === 'sold' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {listing.status || 'active'}
          </span>

          {listing.isBoosted ? (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
              <Zap size={10} /> BOOSTED
            </span>
          ) : (
            <button
              onClick={() => router.push(`/listings/${listing.id}`)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:from-amber-100 hover:to-orange-100 transition flex items-center gap-1"
            >
              <Zap size={12} /> Boost Ad
            </button>
          )}

          <div className="flex items-center gap-0.5 bg-slate-50 rounded-lg p-0.5">
            <Link href={`/listings/${listing.id}`}>
              <span className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-600 hover:bg-white rounded-md transition cursor-pointer">
                <Eye size={14} /> View
              </span>
            </Link>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-white rounded-md transition"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-white rounded-md transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </>
  );
}
