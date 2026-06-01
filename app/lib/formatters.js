/**
 * Centralized formatter functions to eliminate code duplication
 */

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    let date;
    // Handle Firestore Timestamp
    if (dateString?.toDate) {
      date = dateString.toDate();
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Recently';
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (err) {
    return 'Recently';
  }
};

export const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  try {
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (err) {
    return 'Just now';
  }
};

export const formatYear = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.getFullYear();
  } catch (err) {
    return 'Unknown';
  }
};
