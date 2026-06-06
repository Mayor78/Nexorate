import { db } from './firebase/config';
import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, doc, serverTimestamp, getDoc, increment } from 'firebase/firestore';

export const submitReview = async ({ sellerId, reviewerId, reviewerName, listingId, rating, comment }) => {
  if (!sellerId || !reviewerId || !rating) {
    return { success: false, error: 'Missing required fields' };
  }
  if (sellerId === reviewerId) {
    return { success: false, error: 'You cannot rate yourself' };
  }
  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5' };
  }

  try {
    const existingQuery = query(
      collection(db, 'reviews'),
      where('reviewerId', '==', reviewerId),
      where('listingId', '==', listingId)
    );
    const existingSnap = await getDocs(existingQuery);
    if (!existingSnap.empty) {
      return { success: false, error: 'You have already reviewed this listing' };
    }

    const reviewRef = await addDoc(collection(db, 'reviews'), {
      sellerId,
      reviewerId,
      reviewerName,
      listingId: listingId || null,
      rating,
      comment: comment || '',
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'users', sellerId), {
      totalReviews: increment(1),
      totalRating: increment(rating),
    });

    const userSnap = await getDoc(doc(db, 'users', sellerId));
    const userData = userSnap.data();
    const avgRating = userData.totalRating / userData.totalReviews;

    await updateDoc(doc(db, 'users', sellerId), {
      rating: Math.round(avgRating * 10) / 10,
    });

    return { success: true, id: reviewRef.id };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: error.message };
  }
};

export const getSellerReviews = async (sellerId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getSellerRatingSummary = async (sellerId) => {
  try {
    const q = query(collection(db, 'reviews'), where('sellerId', '==', sellerId));
    const snap = await getDocs(q);
    const reviews = snap.docs.map(d => d.data());
    const total = reviews.length;
    if (total === 0) return { total: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { if (distribution[r.rating] !== undefined) distribution[r.rating]++; });
    
    return {
      total,
      average: Math.round((sum / total) * 10) / 10,
      distribution,
    };
  } catch (error) {
    console.error('Error fetching rating summary:', error);
    return { total: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
};

export const hasUserReviewed = async (reviewerId, listingId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('reviewerId', '==', reviewerId),
      where('listingId', '==', listingId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error checking review status:', error);
    return false;
  }
};
