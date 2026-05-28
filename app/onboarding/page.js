'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { 
  User, MapPin, Phone, Building, Store, UserCircle, 
  ArrowRight, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, fetchUserData, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    location: '',
    userType: 'individual',
    businessName: '',
  });
  
  const [errors, setErrors] = useState({});

  // Check if user already completed onboarding
  useEffect(() => {
    if (!authLoading && userData) {
      if (userData.onboardingCompleted) {
        router.push('/');
      }
      
      // Pre-fill with existing user data
      setFormData(prev => ({
        ...prev,
        displayName: userData.displayName || '',
        phone: userData.phone || '',
        location: userData.location || '',
        userType: userData.userType || 'individual',
        businessName: userData.businessName || '',
      }));
    }
  }, [userData, authLoading, router]);

  // If no user, redirect to auth
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.userType === 'business' && !formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!user) {
        throw new Error('User not found');
      }
      
      const userRef = doc(db, 'users', user.uid);
      
      const updateData = {
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        userType: formData.userType,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (formData.userType === 'business') {
        updateData.businessName = formData.businessName;
      }
      
      console.log('Updating user document...', updateData);
      await setDoc(userRef, updateData, { merge: true });
      console.log('User document updated successfully');
      
      // Refresh user data in context
      try {
        await fetchUserData(user.uid);
      } catch (fetchError) {
        console.warn('Warning: Could not refresh user data after update:', fetchError);
        // Continue anyway - the update was successful
      }
      
      // Redirect to home
      setLoading(false);
      router.push('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error.message || 'Failed to save information. Please try again.');
      setLoading(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-sky-500' : 'bg-slate-200'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 transition-all duration-300 ${
              step >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              {step > 1 ? <CheckCircle size={16} /> : '1'}
            </div>
            <div className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-sky-500' : 'bg-slate-200'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 transition-all duration-300 ${
              step >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : '2'}
            </div>
            <div className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-sky-500' : 'bg-slate-200'}`}></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
            <span>Profile</span>
            <span>Type</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <UserCircle size={32} className="text-sky-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {step === 1 ? 'Tell us about yourself' : 'How do you want to use Nexorate?'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {step === 1 
                  ? 'Help us personalize your marketplace experience' 
                  : 'Choose how you want to buy, sell, and connect'}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition ${
                        errors.displayName ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.displayName && (
                    <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition ${
                        errors.phone ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Buyers and sellers will use this to contact you
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition ${
                        errors.location ? 'border-red-400' : 'border-slate-200'
                      }`}
                      placeholder="Lagos, Nigeria"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: User Type */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {/* Individual Option */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.userType === 'individual' 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="userType"
                      value="individual"
                      checked={formData.userType === 'individual'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.userType === 'individual' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Individual</p>
                        <p className="text-sm text-slate-500">Buy and sell as a private person</p>
                      </div>
                    </div>
                    {formData.userType === 'individual' && (
                      <CheckCircle size={20} className="text-sky-500" />
                    )}
                  </label>

                  {/* Business Option */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.userType === 'business' 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="userType"
                      value="business"
                      checked={formData.userType === 'business'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.userType === 'business' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Business / Store</p>
                        <p className="text-sm text-slate-500">Sell products professionally</p>
                      </div>
                    </div>
                    {formData.userType === 'business' && (
                      <CheckCircle size={20} className="text-sky-500" />
                    )}
                  </label>
                </div>

                {/* Business Name (conditional) */}
                {formData.userType === 'business' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition ${
                          errors.businessName ? 'border-red-400' : 'border-slate-200'
                        }`}
                        placeholder="Your Business Name"
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {step === 2 ? 'Complete Setup' : 'Continue'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          This information helps connect you with buyers and sellers in your area
        </p>
      </div>
    </div>
  );
}