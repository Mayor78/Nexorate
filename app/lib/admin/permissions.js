import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const isAdmin = async (userId) => {
  if (!userId) return false;
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch {
    return false;
  }
};

export const requireAdmin = async (userId) => {
  const admin = await isAdmin(userId);
  if (!admin) throw new Error('Unauthorized: Admin access required');
  return true;
};
