import { db } from './firebase/config';
import { doc, updateDoc, increment } from 'firebase/firestore';

export const markListingAsSold = async (listingId, sellerId) => {
  try {
    await updateDoc(doc(db, 'listings', listingId), {
      status: 'sold',
      soldAt: new Date().toISOString(),
    });

    if (sellerId) {
      await updateDoc(doc(db, 'users', sellerId), {
        totalSales: increment(1),
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markListingAsActive = async (listingId, sellerId) => {
  try {
    await updateDoc(doc(db, 'listings', listingId), {
      status: 'active',
      soldAt: null,
    });

    if (sellerId) {
      await updateDoc(doc(db, 'users', sellerId), {
        totalSales: increment(-1),
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
