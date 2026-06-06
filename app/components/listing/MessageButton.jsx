'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import QuickMessage from './QuickMessage';
import { doc, collection, query, where, getDocs, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { trackListingEvent } from '../../lib/analytics';

export default function MessageButton({ listing, seller, user, onNeedLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (messageText) => {
    if (!user) {
      onNeedLogin();
      return false;
    }

    if (user.uid === listing.sellerId) {
      alert('You cannot message yourself');
      return false;
    }

    setIsSending(true);
    try {
      const conversationsRef = collection(db, 'conversations');
      const existingQuery = query(
        conversationsRef,
        where('participants', 'array-contains', user.uid),
        where('listingId', '==', listing.id)
      );
      
      const existingSnap = await getDocs(existingQuery);
      let conversationId;

      // Create message object with ISO timestamp (not serverTimestamp)
      const now = new Date();
      const messageObj = {
        senderId: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Buyer',
        text: messageText,
        timestamp: now.toISOString(),
        read: false,
      };

      if (!existingSnap.empty) {
        conversationId = existingSnap.docs[0].id;
        
        // Update existing conversation
        await updateDoc(doc(db, 'conversations', conversationId), {
          messages: arrayUnion(messageObj),
          lastMessage: messageText,
          updatedAt: now.toISOString(),
        });
      } else {
        // Create new conversation
        const firstImage = listing.images?.[0];
        const productImage = typeof firstImage === 'object' ? firstImage?.url : firstImage;
        
        const conversationRef = doc(conversationsRef);
        conversationId = conversationRef.id;
        const nowStr = now.toISOString();

        await setDoc(conversationRef, {
          id: conversationId,
          participants: [user.uid, listing.sellerId],
          buyerId: user.uid,
          sellerId: listing.sellerId,
          buyerName: user.displayName || user.email?.split('@')[0] || 'Buyer',
          sellerName: seller?.name || listing.sellerName || 'Seller',
          listingId: listing.id,
          productName: listing.title,
          productImage: productImage ? { url: productImage } : null,
          lastMessage: messageText,
          updatedAt: nowStr,
          messages: [messageObj],
          createdAt: nowStr,
        });
      }

      trackListingEvent(listing.id, 'conversation_started', { title: listing.title }).catch(() => {});
      setIsOpen(false);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition"
      >
        <MessageCircle size={20} />
        Message Seller
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Message Seller</h3>
                <p className="text-xs text-slate-500 mt-0.5">About: {listing.title}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <QuickMessage onSendMessage={handleSendMessage} isSending={isSending} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}