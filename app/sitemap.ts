import type { MetadataRoute } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const CATEGORY_SLUGS = [
  'phones',
  'cars',
  'fashion',
  'electronics',
  'properties',
  'services',
  'jobs',
  'furniture',
  'books',
  'sports',
  'repair-construction',
  'animal-pet',
  'food-agric',
  'trending',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexorate.ng';
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // Categories page
  entries.push({
    url: `${siteUrl}/categories`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Individual category pages
  for (const slug of CATEGORY_SLUGS) {
    entries.push({
      url: `${siteUrl}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // Active listings
  try {
    const q = query(collection(db, 'listings'), where('status', '==', 'active'));
    const snap = await getDocs(q);

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const listingUrl = `${siteUrl}/listings/${doc.id}`;
      const updatedAt = data.updatedAt || data.createdAt;

      entries.push({
        url: listingUrl,
        lastModified: updatedAt ? new Date(updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Sitemap: failed to fetch listings', error);
  }

  return entries;
}
