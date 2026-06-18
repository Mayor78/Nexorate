'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { getUserPreferences } from '../../lib/tracking/userActivity';
import RecommendationCard from '../ui/RecommendationCard';
import Carousel from '../ui/Carousel';

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);

  // Fetch all active listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        const snapshot = await getDocs(q);
        const listings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllListings(listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    
    fetchListings();
  }, []);

  // Get user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (user) {
        const prefs = await getUserPreferences(user.uid);
        setUserPreferences(prefs);
      }
    };
    fetchPreferences();
  }, [user]);

  // Generate recommendations based on category preferences AND search terms
  useEffect(() => {
    if (allListings.length === 0) return;
    
    setLoading(true);
    
    try {
      let recommendedListings = [];
      
      if (user && userPreferences) {
        // Get user's top categories and search terms
        const topCategories = userPreferences.topCategories || [];
        const topSearchTerms = userPreferences.topSearchTerms || [];
        
        // Score each listing based on user activity
        const scoredListings = allListings.map(listing => {
          let score = 0;
          
          // Category match (highest priority)
          if (topCategories.includes(listing.category)) {
            score += 15;
          }
          
          // Search term match in title (high priority)
          topSearchTerms.forEach(term => {
            if (listing.title?.toLowerCase().includes(term.toLowerCase())) {
              score += 10;
            }
            if (listing.description?.toLowerCase().includes(term.toLowerCase())) {
              score += 5;
            }
          });
          
          // Partial word match for search terms
          topSearchTerms.forEach(term => {
            const words = listing.title?.toLowerCase().split(' ') || [];
            words.forEach(word => {
              if (word.includes(term.toLowerCase()) || term.toLowerCase().includes(word)) {
                score += 3;
              }
            });
          });
          
          if (listing.isBoosted) {
            score += 5;
          }
          
          score += (listing.views || 0) / 100;
          
          return { listing, score };
        });
        
        const topRecommendations = scoredListings
          .sort((a, b) => b.score - a.score)
          .slice(0, 15)
          .map(item => item.listing);
        
        recommendedListings = topRecommendations;
        
        if (recommendedListings.length < 8) {
          const trendingListings = [...allListings]
            .filter(l => !recommendedListings.some(r => r.id === l.id))
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 8 - recommendedListings.length);
          
          recommendedListings = [...recommendedListings, ...trendingListings];
        }
      } else {
        const trendingListings = [...allListings]
          .filter(l => l.status === 'active')
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 15);
        
        recommendedListings = trendingListings;
      }
      
      setRecommendations(recommendedListings);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(allListings.slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, [allListings, user, userPreferences]);

  const getTitle = () => {
    if (!user) return "Trending Now";
    if (userPreferences?.topCategories?.length > 0) {
      const category = userPreferences.topCategories[0];
      return `Recommended • ${category}`;
    }
    if (userPreferences?.topSearchTerms?.length > 0) {
      const searchTerm = userPreferences.topSearchTerms[0];
      return `Based on "${searchTerm}"`;
    }
    return "Recommended for You";
  };

  const getSeeAllLink = () => {
    if (!user) return '/categories';
    if (userPreferences?.topCategories?.length > 0) {
      const category = userPreferences.topCategories[0];
      return `/categories/${category.toLowerCase()}`;
    }
    return '/categories';
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-3 bg-white border-y border-slate-100 my-2">
      <Carousel 
        title={getTitle()} 
        seeAllLink={getSeeAllLink()}
      >
        {recommendations.map((listing) => (
          <div key={listing.id} className="w-[160px] sm:w-[180px] shrink-0">
            <RecommendationCard listing={listing} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}