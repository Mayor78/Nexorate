import { db } from './firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { sendBoostNotificationToAllUsers } from './notifications';
import { trackListingEvent } from './analytics';

export const BOOST_PLANS = {
  basic: { name: 'Basic Boost', days: 3, price: 500, level: 1, color: 'amber' },
  standard: { name: 'Standard Boost', days: 7, price: 1500, level: 2, color: 'orange' },
  premium: { name: 'Premium Boost', days: 14, price: 3500, level: 3, color: 'rose' },
  ultimate: { name: 'Ultimate Boost', days: 30, price: 7000, level: 4, color: 'violet' },
};

export const boostListing = async (listingId, planKey, userId) => {
  if (!listingId || !planKey || !userId) {
    return { success: false, error: 'Missing required parameters' };
  }
  const plan = BOOST_PLANS[planKey];
  if (!plan) return { success: false, error: 'Invalid boost plan' };

  try {
    const listingRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) return { success: false, error: 'Listing not found' };
    if (listingSnap.data().sellerId !== userId) {
      return { success: false, error: 'You do not own this listing' };
    }

    const boostEnd = new Date();
    boostEnd.setDate(boostEnd.getDate() + plan.days);

    await updateDoc(listingRef, {
      isBoosted: true,
      boostLevel: plan.level,
      boostPlan: planKey,
      boostStartsAt: serverTimestamp(),
      boostEndsAt: boostEnd.toISOString(),
      boostPrice: plan.price,
      updatedAt: serverTimestamp(),
    });

    const listingData = listingSnap.data();
    sendBoostNotificationToAllUsers({ id: listingId, ...listingData }, plan).catch(e =>
      console.error('Notification sending failed:', e)
    );

    trackListingEvent(listingId, 'boost_start', { plan: planKey, planName: plan.name }).catch(() => {});

    return { success: true, plan };
  } catch (error) {
    console.error('Error boosting listing:', error);
    return { success: false, error: error.message };
  }
};

export const getBoostedListingsQuery = () => {
  return query(
    collection(db, 'listings'),
    where('isBoosted', '==', true),
    where('status', '==', 'active'),
    orderBy('boostLevel', 'desc'),
    orderBy('boostStartsAt', 'desc'),
    limit(12)
  );
};

export const getBoostedListings = async () => {
  try {
    const q = getBoostedListingsQuery();
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching boosted listings:', error);
    return [];
  }
};

export const getListingBoostStatus = async (listingId) => {
  try {
    const listingRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) return null;
    const data = listingSnap.data();
    return {
      isBoosted: data.isBoosted || false,
      boostPlan: data.boostPlan || null,
      boostLevel: data.boostLevel || 0,
      boostEndsAt: data.boostEndsAt || null,
    };
  } catch (error) {
    console.error('Error fetching boost status:', error);
    return null;
  }
};

export const formatBoostPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};
