'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { validateListing } from '../../lib/validators';
import CategorySelector from '../../components/post/CategorySelector';
import BasicInfoForm from '../../components/post/BasicInfoForm';
import DynamicFieldsForm from '../../components/post/DynamicFieldsForm';
import DescriptionInput from '../../components/post/DescriptionInput';
import CloudinaryUploader from '../../components/post/CloudinaryUploader';
import SubmitButton from '../../components/post/SubmitButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PostListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');
  const { user, userData, refreshUserData } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [customFields, setCustomFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(editId ? true : false);

  // Fetch listing data if editing
  useEffect(() => {
    if (!editId) return;

    const fetchListing = async () => {
      try {
        const listingRef = doc(db, 'listings', editId);
        const listingSnap = await getDoc(listingRef);
        
        if (listingSnap.exists()) {
          const data = listingSnap.data();
          if (data.sellerId !== user?.uid) {
            showError('You do not have permission to edit this listing');
            router.push('/profile');
            return;
          }
          setSelectedCategory(data.category || '');
          setTitle(data.title || '');
          setPrice(data.price?.toString() || '');
          setLocation(data.location || '');
          setDescription(data.description || '');
          setCustomFields(data.customFields || {});
          // Convert Firestore image format to our format
          if (data.images && Array.isArray(data.images)) {
            setImages(data.images.map(img => ({
              url: img.url,
              thumbnail: img.thumbnail || img.url,
              id: img.publicId,
              width: img.width,
              height: img.height,
              format: img.format,
              bytes: img.bytes
            })));
          }
        } else {
          showError('Listing not found');
          router.push('/profile');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        showError('Failed to load listing for editing');
        router.push('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [editId, router, showError, user?.uid]);

  // Reset custom fields when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCustomFields({});
  };

  const handleFieldChange = (name, value) => {
    setCustomFields(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to post a listing');
      }

      // ✅ FIXED: Use validator
      const listingValidation = validateListing({ title, price, description, category: selectedCategory, images });
      if (!listingValidation.valid) {
        showError(listingValidation.error);
        setError(listingValidation.error);
        setIsSubmitting(false);
        return;
      }

      // Extract image URLs from Cloudinary uploads
      const imageUrls = images.map(img => ({
        url: img.url,
        thumbnail: img.thumbnail || img.url,
        publicId: img.id,
        width: img.width,
        height: img.height,
        format: img.format
      }));

      // Prepare listing data with denormalized seller info ✅ FIXED
      const listingData = {
        title: title.trim(),
        price: parseFloat(price),
        location: location.trim(),
        description: description.trim(),
        category: selectedCategory,
        sellerId: user.uid,
        sellerName: userData?.displayName || 'Anonymous',
        sellerEmail: userData?.email || user?.email,
        sellerAvatar: userData?.avatar || null,
        sellerRating: userData?.rating || 0,
        customFields: customFields,
        images: imageUrls,
        mainImage: imageUrls[0]?.url || null,
        status: 'active',
        updatedAt: serverTimestamp(),
      };

      // Add createdAt only for new listings
      if (!editId) {
        listingData.createdAt = serverTimestamp();
        listingData.views = 0;
      }

      if (editId) {
        // Verify ownership before update
        const listingRef = doc(db, 'listings', editId);
        const existingSnap = await getDoc(listingRef);
        if (!existingSnap.exists() || existingSnap.data().sellerId !== user.uid) {
          showError('You do not have permission to edit this listing');
          setIsSubmitting(false);
          return;
        }
        await updateDoc(listingRef, listingData);
        console.log('Listing updated with ID:', editId);
        showSuccess('Listing updated successfully!');
        router.push(`/listings/${editId}`);
      } else {
        // Create new listing
        const docRef = await addDoc(collection(db, 'listings'), listingData);
        console.log('Listing created with ID:', docRef.id);
        showSuccess('Listing created successfully!');
        router.push(`/listings/${docRef.id}`);
      }

      // Refresh user data to update listings count
      await refreshUserData();
      
    } catch (err) {
      console.error('Error saving listing:', err);
      const errorMsg = err.message || 'Failed to save listing. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check authentication
  if (!user) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  // Show loading while fetching listing data for editing
  if (isLoading) {
    return <LoadingSpinner message="Loading listing details..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {editId ? 'Edit Listing' : 'Post a Listing'}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {editId ? 'Update your listing details' : 'Sell, buy, or swap items across Africa easily'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-3xl mx-auto space-y-4">
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Category Selection */}
        <CategorySelector 
          selectedCategory={selectedCategory} 
          onChange={handleCategoryChange} 
        />

        {/* Basic Information */}
        <BasicInfoForm
          title={title}
          setTitle={setTitle}
          price={price}
          setPrice={setPrice}
          location={location}
          setLocation={setLocation}
        />

        {/* Dynamic Category Fields */}
        <DynamicFieldsForm
          selectedCategory={selectedCategory}
          customFields={customFields}
          onFieldChange={handleFieldChange}
        />

        {/* Description */}
        <DescriptionInput 
          value={description} 
          onChange={setDescription} 
        />

        {/* Cloudinary Image Upload */}
        <CloudinaryUploader
          images={images}
          onImagesChange={handleImagesChange}
          onRemoveImage={handleRemoveImage}
        />

        {/* Submit Button */}
        <SubmitButton isLoading={isSubmitting} text="Post Listing" />
        
      </form>
    </div>
  );
}