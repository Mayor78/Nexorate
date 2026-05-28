'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Eye } from 'lucide-react';
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
      onDelete?.(listing.id);
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

  // Get formatted date safely
  const getFormattedDate = () => {
    if (!listing.createdAt) return 'Recently';
    return formatDate(listing.createdAt);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 hover:shadow-md transition">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{listing.title}</h3>
          <p className="text-sky-600 font-medium">{formatPrice(listing.price)}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{listing.views || 0} views</span>
            <span>•</span>
            <span>Posted {getFormattedDate()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            listing.status === 'active' ? 'bg-green-100 text-green-700' : 
            listing.status === 'sold' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {listing.status || 'active'}
          </span>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Link href={`/listings/${listing.id}`}>
              <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition" title="View">
                <Eye size={16} />
              </button>
            </Link>
            <button 
              onClick={handleEdit}
              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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