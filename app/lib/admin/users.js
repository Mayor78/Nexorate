import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const getAllUsers = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUser = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const banUser = async (userId) => {
  return updateUser(userId, { banned: true, bannedAt: new Date().toISOString() });
};

export const unbanUser = async (userId) => {
  return updateUser(userId, { banned: false, bannedAt: null });
};

export const makeAdmin = async (userId) => {
  return updateUser(userId, { role: 'admin' });
};

export const removeAdmin = async (userId) => {
  return updateUser(userId, { role: 'user' });
};
