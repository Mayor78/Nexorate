'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const categoryNames = [
  { name: 'Phones', slug: 'phones', icon: '📱', color: 'blue' },
  { name: 'Cars', slug: 'cars', icon: '🚗', color: 'green' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', color: 'pink' },
  { name: 'Properties', slug: 'properties', icon: '🏠', color: 'purple' },
  { name: 'Electronics', slug: 'electronics', icon: '💻', color: 'cyan' },
  { name: 'Personals', slug: 'personals', icon: '💕', color: 'red' },
  { name: 'Jobs', slug: 'jobs', icon: '💼', color: 'orange' },
  { name: 'Services', slug: 'services', icon: '🔧', color: 'gray' },
];

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        
        const categoriesWithCounts = await Promise.all(
          categoryNames.map(async (category) => {
            const q = query(
              listingsRef,
              where('category', '==', category.name),
              where('status', '==', 'active')
            );
            const snapshot = await getDocs(q);
            return {
              ...category,
              count: snapshot.size,
              countFormatted: snapshot.size.toLocaleString(),
            };
          })
        );
        
        setCategories(categoriesWithCounts);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get category by slug
  const getCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  // Helper function to get category by name
  const getCategoryByName = (name) => {
    return categories.find(cat => cat.name === name);
  };

  // Total listings count across all categories
  const totalListings = categories.reduce((sum, cat) => sum + cat.count, 0);

  return {
    categories,
    loading,
    error,
    getCategoryBySlug,
    getCategoryByName,
    totalListings,
  };
}