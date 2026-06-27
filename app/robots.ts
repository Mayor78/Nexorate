import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexorate.ng';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth', '/admin', '/post', '/messages', '/saved', '/profile'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
