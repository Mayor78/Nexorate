const SITE_URL = 'https://www.nexorate.ng';

const SLUG_TO_CATEGORY = {
  'all': 'All Categories',
  'phones': 'Phones',
  'cars': 'Cars',
  'fashion': 'Fashion',
  'properties': 'Properties',
  'electronics': 'Electronics',
  'personals': 'Personals',
  'jobs': 'Jobs',
  'services': 'Services',
  'repair-construction': 'Repair & Construction',
  'animal-pet': 'Animal & Pet',
  'food-agric': 'Food & Agric',
  'beauty': 'Beauty',
  'trending': 'Trending',
};

const CATEGORY_META = {
  phones: {
    title: 'Phones for Sale in Nigeria — Buy & Sell Used & New Phones',
    description: 'Browse the best deals on used and new phones in Nigeria. iPhones, Samsung, Tecno, Infinix and more. Find great prices on Nexorate.',
  },
  cars: {
    title: 'Cars for Sale in Nigeria — New & Used Vehicles',
    description: 'Find your next car on Nexorate. Browse thousands of new and used cars for sale across Nigeria. Toyota, Honda, Mercedes and more.',
  },
  fashion: {
    title: 'Fashion Marketplace Nigeria — Buy & Sell Clothes, Shoes & Accessories',
    description: 'Shop affordable fashion in Nigeria. Discover clothes, shoes, bags, wristwatches, and accessories from trusted sellers on Nexorate.',
  },
  properties: {
    title: 'Properties for Sale & Rent in Nigeria — Houses, Apartments, Land',
    description: 'Find houses, apartments, land, and commercial properties for sale or rent across Nigeria. Connect directly with property owners on Nexorate.',
  },
  electronics: {
    title: 'Electronics for Sale in Nigeria — Laptops, TVs, Gadgets & More',
    description: 'Buy and sell electronics in Nigeria. Laptops, TVs, home appliances, gaming consoles, and gadgets at the best prices on Nexorate.',
  },
  jobs: {
    title: 'Jobs in Nigeria — Find Work & Hire Talent',
    description: 'Discover job opportunities across Nigeria or post a vacancy. Connect with skilled professionals and employers on Nexorate.',
  },
  services: {
    title: 'Services in Nigeria — Find & Offer Professional Services',
    description: 'Hire trusted professionals or offer your services. From repairs to consulting, find everything you need on Nexorate.',
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = SLUG_TO_CATEGORY[slug] || 'Categories';
  const meta = CATEGORY_META[slug] || {};

  const title = meta.title || `${categoryName} — Buy & Sell on Nexorate Nigeria`;
  const description = meta.description || `Browse ${categoryName.toLowerCase()} listings on Nexorate. Find the best deals from trusted sellers across Nigeria.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: slug === 'all' ? `${SITE_URL}/categories` : `${SITE_URL}/categories/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: slug === 'all' ? `${SITE_URL}/categories` : `${SITE_URL}/categories/${slug}`,
    },
  };
}

export default async function CategoryLayout({ children, params }) {
  const { slug } = await params;
  const categoryName = SLUG_TO_CATEGORY[slug] || 'Categories';
  const pageUrl = slug === 'all' ? `${SITE_URL}/categories` : `${SITE_URL}/categories/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
