import { db } from '../firebase/config';
import { doc, setDoc, updateDoc, arrayUnion, increment, getDoc, serverTimestamp } from 'firebase/firestore';

// Track user activity
export const trackUserActivity = async (userId, activityType, data) => {
  if (!userId) return;

  try {
    const activityRef = doc(db, 'userActivity', userId);
    const activityDoc = await getDoc(activityRef);
    
    const timestamp = new Date().toISOString();
    
    const activity = {
      type: activityType, // 'view_listing', 'search', 'view_profile', 'click_category'
      data: data,
      timestamp: timestamp,
    };
    
    if (!activityDoc.exists()) {
      // Create new activity document
      await setDoc(activityRef, {
        userId: userId,
        activities: [activity],
        viewedCategories: {},
        viewedListings: {},
        searchTerms: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing activity
      await updateDoc(activityRef, {
        activities: arrayUnion(activity),
        updatedAt: serverTimestamp(),
      });
      
      // Update category/view counts
      if (activityType === 'view_listing' && data.category) {
        await updateDoc(activityRef, {
          [`viewedCategories.${data.category}`]: increment(1),
          [`viewedListings.${data.listingId}`]: {
            title: data.title,
            category: data.category,
            viewedAt: timestamp,
            count: increment(1)
          }
        });
      }
      
      if (activityType === 'search' && data.term) {
        await updateDoc(activityRef, {
          [`searchTerms.${data.term.toLowerCase()}`]: increment(1)
        });
      }
      
      if (activityType === 'click_category' && data.category) {
        await updateDoc(activityRef, {
          [`viewedCategories.${data.category}`]: increment(1)
        });
      }
    }
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

// Get user preferences for recommendations
export const getUserPreferences = async (userId) => {
  if (!userId) return null;
  
  try {
    const activityRef = doc(db, 'userActivity', userId);
    const activityDoc = await getDoc(activityRef);
    
    if (!activityDoc.exists()) return null;
    
    const data = activityDoc.data();
    const viewedCategories = data.viewedCategories || {};
    const searchTerms = data.searchTerms || {};
    const viewedListings = data.viewedListings || {};
    
    // Get top categories by view count
    const topCategories = Object.entries(viewedCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
    
    // Get top search terms
    const topSearchTerms = Object.entries(searchTerms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term]) => term);
    
    return {
      topCategories,
      topSearchTerms,
      viewedListingsCount: Object.keys(viewedListings).length,
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return null;
  }
};

// Get personalized recommendations based on user activity
export const getRecommendations = async (userId, allListings) => {
  const preferences = await getUserPreferences(userId);
  
  if (!preferences || preferences.topCategories.length === 0) {
    // Return trending/popular listings if no preferences
    return getTrendingListings(allListings);
  }
  
  // Score each listing based on user preferences
  const scoredListings = allListings.map(listing => {
    let score = 0;
    
    // Category match
    if (preferences.topCategories.includes(listing.category)) {
      score += 10;
    }
    
    // Search term match in title
    preferences.topSearchTerms.forEach(term => {
      if (listing.title?.toLowerCase().includes(term.toLowerCase())) {
        score += 5;
      }
      if (listing.description?.toLowerCase().includes(term.toLowerCase())) {
        score += 3;
      }
    });
    
    // Boosted listings get higher score
    if (listing.isBoosted) {
      score += 2;
    }
    
    return { listing, score };
  });
  
  // Sort by score and return top recommendations
  return scoredListings
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.listing);
};

// Get trending/popular listings (fallback)
const getTrendingListings = (allListings) => {
  return [...allListings]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
};