'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useToast } from '../context/ToastContext';

export function useAuthHandler() {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const isIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  const isAndroid = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  }, []);

  const handleSignup = useCallback(async (email, password, displayName) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      showSuccess('Account created successfully!');
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : err.code === 'auth/weak-password'
        ? 'Password too weak (min 6 characters)'
        : err.message;
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const handleLogin = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showSuccess('Logged in successfully!');
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'Email not found'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.message;
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const handleGoogleSignin = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let result;

      // iOS doesn't support popups well, use redirect instead
      if (isIOS()) {
        await signInWithRedirect(auth, provider);
        // The app will reload after redirect, so we won't reach here
        // but getRedirectResult handles the result on app reload
      } else {
        // Desktop/Android can use popup
        result = await signInWithPopup(auth, provider);
      }

      showSuccess('Signed in with Google!');
      return { success: true, user: result?.user };
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        showError('Failed to sign in with Google');
      }
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isIOS, showError, showSuccess]);

  const handleGoogleRedirectResult = useCallback(async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        showSuccess('Signed in with Google!');
        return { success: true, user: result.user };
      }
    } catch (err) {
      showError('Failed to sign in with Google');
      return { success: false, error: err.message };
    }
  }, [showError, showSuccess]);

  const handlePasswordReset = useCallback(async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showSuccess('Password reset email sent. Check your inbox.');
      return { success: true };
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'Email not found'
        : 'Failed to send reset email';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    isIOS,
    isAndroid,
    loading,
    handleSignup,
    handleLogin,
    handleGoogleSignin,
    handleGoogleRedirectResult,
    handlePasswordReset,
  };
}
