import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export function useFeaturedListings() {
  return useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: async () => {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    staleTime: 60 * 1000,
  });
}

export function useBoostedListings() {
  return useQuery({
    queryKey: ['listings', 'boosted'],
    queryFn: async () => {
      const q = query(
        collection(db, 'listings'),
        where('isBoosted', '==', true),
        where('status', '==', 'active'),
        orderBy('boostLevel', 'desc'),
        orderBy('boostStartsAt', 'desc'),
        limit(12)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    staleTime: 30 * 1000,
  });
}

export function useCategoryListings(category) {
  return useQuery({
    queryKey: ['listings', 'category', category],
    queryFn: async () => {
      const constraints = [where('status', '==', 'active')];
      if (category && category !== 'All') {
        constraints.push(where('category', '==', category));
      }
      const q = query(collection(db, 'listings'), ...constraints);
      const snap = await getDocs(q);
      const listings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      listings.sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return db - da;
      });
      return listings;
    },
    staleTime: 60 * 1000,
    enabled: !!category,
  });
}

export function useListing(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { doc, getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'listings', id));
      if (!snap.exists()) throw new Error('Listing not found');
      return { id: snap.id, ...snap.data() };
    },
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}

export function useUserNotifications(userId) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(30)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    staleTime: 15 * 1000,
    enabled: !!userId,
  });
}
