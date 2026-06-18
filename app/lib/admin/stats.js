import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getAdminStats = async () => {
  try {
    const [usersSnap, listingsSnap, conversationsSnap, reviewsSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'listings')),
      getDocs(collection(db, 'conversations')),
      getDocs(collection(db, 'reviews')),
    ]);

    const users = usersSnap.docs.map(d => d.data());
    const listings = listingsSnap.docs.map(d => d.data());
    const conversations = conversationsSnap.docs.map(d => d.data());
    const reviews = reviewsSnap.docs.map(d => d.data());

    return {
      totalUsers: usersSnap.size,
      totalListings: listingsSnap.size,
      activeListings: listings.filter(l => l.status === 'active').length,
      boostedListings: listings.filter(l => l.isBoosted).length,
      totalConversations: conversationsSnap.size,
      totalReviews: reviewsSnap.size,
      totalRevenue: listings.filter(l => l.isBoosted).reduce((sum, l) => sum + (l.boostPrice || 0), 0),
      totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
      businessAccounts: users.filter(u => u.userType === 'business').length,
      newUsersToday: users.filter(u => {
        const created = u.createdAt ? new Date(u.createdAt) : null;
        return created && created.toDateString() === new Date().toDateString();
      }).length,
      newListingsToday: listings.filter(l => {
        const created = l.createdAt?.toDate?.() || null;
        return created && created.toDateString() === new Date().toDateString();
      }).length,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
};
