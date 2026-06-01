/**
 * Centralized Firestore query builders to eliminate query duplication
 */

import { collection, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from './firebase/config';

export const QUERIES = {
  // Get featured listings with pagination
  getFeaturedListingsQuery: (lastDoc = null) => {
    const baseQuery = [
      collection(db, 'listings'),
      orderBy('createdAt', 'desc'),
      limit(20)
    ];
    
    if (lastDoc) {
      baseQuery.push(startAfter(lastDoc));
    }
    
    return query(...baseQuery);
  },

  // Get user's listings
  getUserListingsQuery: (userId) => {
    return query(
      collection(db, 'listings'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  },

  // Get user's conversations
  getUserConversationsQuery: (userId) => {
    return query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
  },

  // Get conversations for specific user and listing
  getExistingConversationQuery: (userId, listingId) => {
    return query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      where('listingId', '==', listingId)
    );
  },

  // Get related listings
  getRelatedListingsQuery: (category) => {
    return query(
      collection(db, 'listings'),
      where('category', '==', category),
      limit(6)
    );
  },

  // Get category listings
  getCategoryListingsQuery: (category) => {
    return query(
      collection(db, 'listings'),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  },

  // Search listings by location
  getLocationListingsQuery: (location) => {
    return query(
      collection(db, 'listings'),
      where('location', '==', location),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  },

  // Get seller's profile listings
  getSellerListingsQuery: (sellerId) => {
    return query(
      collection(db, 'listings'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  },
};
