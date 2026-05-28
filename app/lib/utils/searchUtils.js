// lib/utils/searchUtils.js

// Common search term mappings (synonyms and corrections)
const searchMappings = {
  // Category synonyms
  'phone': 'Phones',
  'mobile': 'Phones',
  'smartphone': 'Phones',
  'iphone': 'Phones',
  'samsung': 'Phones',
  'tecno': 'Phones',
  'infinix': 'Phones',
  
  'car': 'Cars',
  'auto': 'Cars',
  'vehicle': 'Cars',
  'automobile': 'Cars',
  'toyota': 'Cars',
  'honda': 'Cars',
  'benz': 'Cars',
  'bmw': 'Cars',
  
  'clothes': 'Fashion',
  'cloth': 'Fashion',
  'wear': 'Fashion',
  'dress': 'Fashion',
  'bag': 'Fashion',
  'shoe': 'Fashion',
  'shoes': 'Fashion',
  
  'house': 'Properties',
  'home': 'Properties',
  'apartment': 'Properties',
  'land': 'Properties',
  'building': 'Properties',
  'flat': 'Properties',
  
  'laptop': 'Electronics',
  'computer': 'Electronics',
  'gadget': 'Electronics',
  'device': 'Electronics',
  'tablet': 'Electronics',
  'ipad': 'Electronics',
  'macbook': 'Electronics',
  
  'dating': 'Personals',
  'relationship': 'Personals',
  'friendship': 'Personals',
  'partner': 'Personals',
  
  'work': 'Jobs',
  'career': 'Jobs',
  'employment': 'Jobs',
  'vacancy': 'Jobs',
  
  'repair': 'Services',
  'service': 'Services',
  'cleaning': 'Services',
  'plumbing': 'Services',
  'electrical': 'Services',
};

// Common typos and corrections
const typoCorrections = {
  'caar': 'car',
  'carr': 'car',
  'carrs': 'cars',
  'phne': 'phone',
  'phon': 'phone',
  'lapotp': 'laptop',
  'lapop': 'laptop',
  'propaty': 'property',
  'proparty': 'property',
};

// Smart search function
export const smartSearch = (listings, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return listings;
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Check if search term matches any category synonym
  let categoryMatch = null;
  for (const [key, value] of Object.entries(searchMappings)) {
    if (normalizedSearch.includes(key) || key.includes(normalizedSearch)) {
      categoryMatch = value;
      break;
    }
  }
  
  // Check for typos
  let correctedTerm = normalizedSearch;
  for (const [typo, correction] of Object.entries(typoCorrections)) {
    if (normalizedSearch === typo || normalizedSearch.includes(typo)) {
      correctedTerm = correction;
      break;
    }
  }

  return listings.filter(listing => {
    const title = (listing.title || '').toLowerCase();
    const description = (listing.description || '').toLowerCase();
    const category = (listing.category || '').toLowerCase();
    const location = (listing.location || '').toLowerCase();
    
    // Exact match in title or description
    if (title.includes(correctedTerm) || description.includes(correctedTerm)) {
      return true;
    }
    
    // Partial word match (e.g., "car" matches "carpet" or "scar"? No, but "cars" matches "car")
    const searchWords = correctedTerm.split(' ');
    const titleWords = title.split(' ');
    const descWords = description.split(' ');
    
    // Check if any search word is contained in any title/description word
    for (const searchWord of searchWords) {
      if (searchWord.length < 2) continue;
      
      for (const titleWord of titleWords) {
        if (titleWord.includes(searchWord) || searchWord.includes(titleWord)) {
          return true;
        }
      }
      
      for (const descWord of descWords) {
        if (descWord.includes(searchWord) || searchWord.includes(descWord)) {
          return true;
        }
      }
    }
    
    // Category match via synonyms
    if (categoryMatch && category === categoryMatch.toLowerCase()) {
      return true;
    }
    
    // Direct category match
    if (category.includes(correctedTerm) || correctedTerm.includes(category)) {
      return true;
    }
    
    // Location match
    if (location.includes(correctedTerm)) {
      return true;
    }
    
    return false;
  });
};

// Smart location filter
export const smartLocationFilter = (listings, locationTerm) => {
  if (!locationTerm || locationTerm.trim() === '') {
    return listings;
  }
  
  const normalizedLocation = locationTerm.toLowerCase().trim();
  
  return listings.filter(listing => {
    const listingLocation = (listing.location || '').toLowerCase();
    
    // Exact match
    if (listingLocation === normalizedLocation) {
      return true;
    }
    
    // Partial match
    if (listingLocation.includes(normalizedLocation) || normalizedLocation.includes(listingLocation)) {
      return true;
    }
    
    // Handle state name variations (e.g., "oyo" matches "Oyo State")
    if (normalizedLocation.includes('state')) {
      const stateName = normalizedLocation.replace('state', '').trim();
      if (listingLocation.includes(stateName)) {
        return true;
      }
    }
    
    return false;
  });
};