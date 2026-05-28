'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../lib/firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Create user document in Firestore
  const createUserDocument = async (firebaseUser) => {
    if (!firebaseUser) return null;
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const newUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous User',
        avatar: firebaseUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        totalListings: 0,
        totalSales: 0,
        location: '',
        phone: '',
        userType: 'individual',
        businessName: '',
        onboardingCompleted: false,
        emailVerified: firebaseUser.emailVerified || false,
      };
      
      await setDoc(userRef, newUserData);
      console.log('User document created for:', firebaseUser.email);
      return newUserData;
    }
    
    console.log('User document exists for:', firebaseUser.email);
    return userSnap.data();
  };

  // Fetch user's listings
  const fetchUserListings = async (userId) => {
    if (!userId) return;
    
    try {
      const listingsQuery = query(
        collection(db, 'listings'),
        where('sellerId', '==', userId)
      );
      const querySnapshot = await getDocs(listingsQuery);
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserListings(listings);
      return listings;
    } catch (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }
  };

  // Fetch saved listings
  const fetchSavedListings = async (userId) => {
    if (!userId) return;
    
    try {
      const savedRef = doc(db, 'users', userId);
      const userDoc = await getDoc(savedRef);
      if (userDoc.exists() && userDoc.data().savedListings) {
        const savedIds = userDoc.data().savedListings;
        if (savedIds.length > 0) {
          // Fetch actual listing data for each saved ID
          const savedPromises = savedIds.map(async (id) => {
            const listingRef = doc(db, 'listings', id);
            const listingDoc = await getDoc(listingRef);
            if (listingDoc.exists()) {
              return { id: listingDoc.id, ...listingDoc.data() };
            }
            return null;
          });
          const saved = (await Promise.all(savedPromises)).filter(item => item !== null);
          setSavedListings(saved);
          return saved;
        }
      }
      setSavedListings([]);
      return [];
    } catch (error) {
      console.error('Error fetching saved listings:', error);
      return [];
    }
  };

  // Sign up with email/password
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });
    await createUserDocument(userCredential.user);
    
    return userCredential;
  };

  // Sign in with email/password
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    
    return result;
  };

  // Sign out
  const logout = async () => {
    setUserListings([]);
    setSavedListings([]);
    setUserData(null);
    return signOut(auth);
  };

  // Reset password
  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    if (!uid) return null;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        return userDoc.data();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  // Refresh all user data (listings, saved, profile)
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
      await fetchUserListings(user.uid);
      await fetchSavedListings(user.uid);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email || 'No user');
      setUser(currentUser);
      
      if (currentUser) {
        const data = await fetchUserData(currentUser.uid);
        await fetchUserListings(currentUser.uid);
        await fetchSavedListings(currentUser.uid);
        setListingsLoading(false);
      } else {
        setUserData(null);
        setUserListings([]);
        setSavedListings([]);
        setListingsLoading(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    userListings,
    savedListings,
    listingsLoading,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    fetchUserData,
    fetchUserListings,
    fetchSavedListings,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}