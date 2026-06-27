import { cache } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

const SITE_URL = 'https://www.nexorate.ng';

const getListing = cache(async (id) => {
  try {
    const snap = await getDoc(doc(db, 'listings', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch {
    return null;
  }
});

function getFirstImageUrl(listing) {
  if (listing?.images?.length > 0) {
    const img = listing.images[0];
    return typeof img === 'object' ? img?.url : img;
  }
  return listing?.image || '';
}

function truncate(str, length = 160) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return {
      title: 'Listing Not Found',
      description: 'This listing may have been removed or is no longer available.',
    };
  }

  const imageUrl = getFirstImageUrl(listing);
  const title = `${listing.title} — ₦${Number(listing.price).toLocaleString()}`;
  const description = truncate(
    listing.description || `Buy ${listing.title} in ${listing.location || 'Nigeria'} on Nexorate. ${listing.category ? 'Category: ' + listing.category : ''}`,
    160
  );

  return {
    title,
    description,
    openGraph: {
      title: `${listing.title} — ₦${Number(listing.price).toLocaleString()} | Nexorate`,
      description,
      url: `${SITE_URL}/listings/${id}`,
      type: 'article',
      images: imageUrl
        ? [{ url: imageUrl, width: 400, height: 520, alt: listing.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} — ₦${Number(listing.price).toLocaleString()}`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/listings/${id}`,
    },
  };
}

export default async function ListingLayout({ children, params }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) return <>{children}</>;

  const imageUrl = getFirstImageUrl(listing);
  const price = Number(listing.price);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description || '',
    image: imageUrl || undefined,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'NGN',
      availability: listing.status === 'sold'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      url: `${SITE_URL}/listings/${id}`,
      seller: {
        '@type': 'Person',
        name: listing.sellerName || 'Nexorate Seller',
      },
    },
  };

  if (listing.location) {
    productSchema.offers.availableAtOrFrom = {
      '@type': 'Place',
      name: listing.location,
    };
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: listing.category || 'Listings',
        item: listing.category
          ? `${SITE_URL}/categories/${listing.category.toLowerCase().replace(/\s+/g, '-')}`
          : `${SITE_URL}/categories`,
      },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="__LISTING_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listing) }}
      />
      {children}
    </>
  );
}
