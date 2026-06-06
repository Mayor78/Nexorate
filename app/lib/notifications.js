import { db } from './firebase/config';
import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const createNotification = async ({ userId, type, title, message, actionUrl, metadata = {} }) => {
  if (!userId || !title || !message) return null;
  try {
    const notifRef = await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      title,
      message,
      actionUrl: actionUrl || null,
      metadata,
      read: false,
      createdAt: serverTimestamp(),
    });
    return notifRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const sendBoostNotificationToAllUsers = async (listing, boostPlan) => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const userIds = usersSnap.docs.map(d => d.id);
    if (userIds.length === 0) return;

    const titles = [
      'Someone wants this gone fast 👀',
      `New find just dropped — ${listing.title}`,
      'This might be exactly what you need 🎯',
      `Don't sleep on this one — ${listing.title}`,
      'Just in: a listing you might love',
      'Quick look before someone grabs it ⚡',
    ];

    const messages = [
      `${listing.title} — the seller is serious about selling. Might be worth a look before it's gone.`,
      `We spotted "${listing.title}" and thought of you. Fresh listing, seller is active.`,
      `Something good just surfaced. "${listing.title}" — check it out while it's still available.`,
      `A seller just put real money behind "${listing.title}". Usually means they want a fast deal. Could work in your favor.`,
      `"${listing.title}" — this one's getting attention. See if the price works for you.`,
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const batch = userIds.slice(0, 100).map(userId =>
      createNotification({
        userId,
        type: 'boost',
        title: randomTitle,
        message: randomMessage,
        actionUrl: `/listings/${listing.id}`,
        metadata: {
          listingId: listing.id,
          listingTitle: listing.title,
          listingImage: listing.images?.[0]?.url || listing.mainImage || '',
          listingPrice: listing.price,
          boostPlan: boostPlan.name,
        },
      })
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error sending boost notifications:', error);
  }
};

export const getUserNotificationsQuery = (userId, limitCount = 50) => {
  return query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
};

export const markNotificationRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
  } catch (error) {
    console.error('Error marking notification read:', error);
  }
};

export const markAllNotificationsRead = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    const batch = snap.docs.map(d => updateDoc(doc(db, 'notifications', d.id), { read: true }));
    await Promise.all(batch);
  } catch (error) {
    console.error('Error marking all notifications read:', error);
  }
};

export const getUnreadNotificationCount = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
