'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';
import { TOAST } from '../lib/constants';

const ToastContext = createContext({});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = TOAST.TYPES.INFO, duration = TOAST.DURATION) => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const success = useCallback((message, duration = TOAST.DURATION) => {
    return showToast(message, TOAST.TYPES.SUCCESS, duration);
  }, [showToast]);

  const error = useCallback((message, duration = TOAST.DURATION) => {
    return showToast(message, TOAST.TYPES.ERROR, duration);
  }, [showToast]);

  const warning = useCallback((message, duration = TOAST.DURATION) => {
    return showToast(message, TOAST.TYPES.WARNING, duration);
  }, [showToast]);

  const info = useCallback((message, duration = TOAST.DURATION) => {
    return showToast(message, TOAST.TYPES.INFO, duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, warning, info }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
