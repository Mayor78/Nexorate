import { db } from './firebase/config';
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, serverTimestamp, getDoc } from 'firebase/firestore';

export const trackListingEvent = async (listingId, eventType, metadata = {}) => {
  if (!listingId || !eventType) return;
  try {
    await addDoc(collection(db, 'listingEvents'), {
      listingId,
      eventType, // 'view', 'click', 'conversation_started', 'boost_start', 'boost_expired'
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const getBoostAnalytics = async (listingId) => {
  if (!listingId) return null;
  try {
    const listingSnap = await getDoc(doc(db, 'listings', listingId));
    if (!listingSnap.exists()) return null;
    const listingData = listingSnap.data();

    const eventsQuery = query(
      collection(db, 'listingEvents'),
      where('listingId', '==', listingId),
      orderBy('timestamp', 'desc'),
      limit(500)
    );
    const eventsSnap = await getDocs(eventsQuery);
    const events = eventsSnap.docs.map(d => d.data());

    const totalViews = events.filter(e => e.eventType === 'view').length;
    const totalClicks = events.filter(e => e.eventType === 'click').length;
    const totalConversations = events.filter(e => e.eventType === 'conversation_started').length;

    const boostStartEvent = events.find(e => e.eventType === 'boost_start');
    const boostStartDate = boostStartEvent?.timestamp?.toDate?.() || null;

    let viewsSinceBoost = 0;
    let clicksSinceBoost = 0;
    let conversationsSinceBoost = 0;

    if (boostStartDate) {
      viewsSinceBoost = events.filter(e => e.eventType === 'view' && e.timestamp?.toDate?.() >= boostStartDate).length;
      clicksSinceBoost = events.filter(e => e.eventType === 'click' && e.timestamp?.toDate?.() >= boostStartDate).length;
      conversationsSinceBoost = events.filter(e => e.eventType === 'conversation_started' && e.timestamp?.toDate?.() >= boostStartDate).length;
    }

    const boostEndsAt = listingData.boostEndsAt ? new Date(listingData.boostEndsAt) : null;
    const isBoostActive = boostEndsAt ? boostEndsAt > new Date() : false;

    return {
      listingId,
      totalViews,
      totalClicks,
      totalConversations,
      viewsSinceBoost,
      clicksSinceBoost,
      conversationsSinceBoost,
      isBoosted: listingData.isBoosted || false,
      boostPlan: listingData.boostPlan || null,
      boostLevel: listingData.boostLevel || 0,
      boostEndsAt: listingData.boostEndsAt || null,
      isBoostActive,
      boostStartsAt: listingData.boostStartsAt || null,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};
