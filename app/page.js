'use client';
import HeroSection from './components/home/HeroSection';
import Recommendation from './components/home/Recommendations';
import CategoriesSection from './components/home/CategoriesSection';
import BoostedListings from './components/home/BoostedListings';
import FeaturedListings from './components/home/FeaturedListings';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <HeroSection />
       <Recommendation />
      <CategoriesSection />
      <BoostedListings />
      
      
      <FeaturedListings />
    </div>
  );
}