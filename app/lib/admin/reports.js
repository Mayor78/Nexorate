import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export const getReports = async () => {
  try {
    const snap = await getDocs(collection(db, 'reports'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return db - da;
      });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const resolveReport = async (reportId, resolution) => {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status: 'resolved',
      resolution,
      resolvedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const dismissReport = async (reportId) => {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status: 'dismissed',
      dismissedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, 'reports', reportId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
