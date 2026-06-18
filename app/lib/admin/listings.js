import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

export const markListingSold = async (listingId) => {
  return updateListing(listingId, { status: 'sold', soldAt: new Date().toISOString() });
};

export const markListingActive = async (listingId) => {
  return updateListing(listingId, { status: 'active', soldAt: null });
};

export const removeBoost = async (listingId) => {
  return updateListing(listingId, {
    isBoosted: false,
    boostLevel: 0,
    boostPlan: null,
    boostEndsAt: null,
  });
};
