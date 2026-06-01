/**
 * Input validation utilities
 */

export const VALIDATION = {
  TITLE_MIN: 5,
  TITLE_MAX: 100,
  PRICE_MIN: 1,
  PRICE_MAX: 50_000_000,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 5000,
  LOCATION_MAX: 100,
  PHONE_PATTERN: /^[0-9+\-\s()]{10,20}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IMAGES_MAX: 5,
};

export const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Title is required' };
  }
  
  const trimmed = title.trim();
  
  if (trimmed.length < VALIDATION.TITLE_MIN) {
    return { valid: false, error: `Title must be at least ${VALIDATION.TITLE_MIN} characters` };
  }
  
  if (trimmed.length > VALIDATION.TITLE_MAX) {
    return { valid: false, error: `Title cannot exceed ${VALIDATION.TITLE_MAX} characters` };
  }
  
  return { valid: true };
};

export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Price must be a valid number' };
  }
  
  if (numPrice < VALIDATION.PRICE_MIN) {
    return { valid: false, error: `Price must be at least ₦${VALIDATION.PRICE_MIN}` };
  }
  
  if (numPrice > VALIDATION.PRICE_MAX) {
    return { valid: false, error: `Price cannot exceed ₦${VALIDATION.PRICE_MAX}` };
  }
  
  return { valid: true };
};

export const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Description is required' };
  }
  
  const trimmed = description.trim();
  
  if (trimmed.length < VALIDATION.DESCRIPTION_MIN) {
    return { valid: false, error: `Description must be at least ${VALIDATION.DESCRIPTION_MIN} characters` };
  }
  
  if (trimmed.length > VALIDATION.DESCRIPTION_MAX) {
    return { valid: false, error: `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX} characters` };
  }
  
  return { valid: true };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION.EMAIL_PATTERN.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true };
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (!VALIDATION.PHONE_PATTERN.test(phone)) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }
  
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { valid: true };
};

export const validateListing = (listingData) => {
  const { title, price, description, category, images } = listingData;
  
  const titleValidation = validateTitle(title);
  if (!titleValidation.valid) return titleValidation;
  
  const priceValidation = validatePrice(price);
  if (!priceValidation.valid) return priceValidation;
  
  const descriptionValidation = validateDescription(description);
  if (!descriptionValidation.valid) return descriptionValidation;
  
  if (!category) {
    return { valid: false, error: 'Please select a category' };
  }
  
  if (!images || images.length === 0) {
    return { valid: false, error: 'Please upload at least one image' };
  }
  
  if (images.length > VALIDATION.IMAGES_MAX) {
    return { valid: false, error: `Maximum ${VALIDATION.IMAGES_MAX} images allowed` };
  }
  
  return { valid: true };
};
