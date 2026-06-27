import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

export const getAllListings = async () => {
  try {
    const snap = await getDocs(collection(db, 'listings'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

export const updateListing = async (listingId, data) => {
  try {
    await updateDoc(doc(db, 'listings', listingId), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteListing = async (listingId) => {
  try {
    await deleteDoc(doc(db, 'listings', listingId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markListingSold = async (listingId, sellerId) => {
  const result = await updateListing(listingId, { status: 'sold', soldAt: new Date().toISOString() });
  if (result.success && sellerId) {
    await updateDoc(doc(db, 'users', sellerId), { totalSales: increment(1) });
  }
  return result;
};

export const markListingActive = async (listingId, sellerId) => {
  const result = await updateListing(listingId, { status: 'active', soldAt: null });
  if (result.success && sellerId) {
    await updateDoc(doc(db, 'users', sellerId), { totalSales: increment(-1) });
  }
  return result;
};

export const removeBoost = async (listingId) => {
  return updateListing(listingId, {
    isBoosted: false,
    boostLevel: 0,
    boostPlan: null,
    boostEndsAt: null,
  });
};
