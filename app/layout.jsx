import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Providers from './providers';
import { ToastProvider } from './context/ToastContext';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexorate.ng'),
  title: {
    default: 'Nexorate — Buy, Sell & Connect in Nigeria',
    template: '%s | Nexorate',
  },
  description:
    "Africa's premium marketplace. Buy, sell, and swap phones, cars, fashion, electronics, properties, and more across Nigeria. Join thousands of buyers and sellers.",
  keywords: [
    'buy and sell Nigeria',
    'online marketplace Nigeria',
    'used phones Lagos',
    'cars for sale Nigeria',
    'fashion marketplace',
    'electronics Nigeria',
    'property listings Nigeria',
    'Nexorate',
  ],
  authors: [{ name: 'Nexorate' }],
  creator: 'Nexorate',
  publisher: 'Nexorate',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Nexorate',
    title: 'Nexorate — Buy, Sell & Connect in Nigeria',
    description:
      "Africa's premium marketplace. Buy, sell, and swap phones, cars, fashion, electronics, properties, and more.",
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexorate — Buy, Sell & Connect in Nigeria',
    description:
      "Africa's premium marketplace. Buy, sell, and swap phones, cars, fashion, electronics, properties, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="bg-slate-50">
        <ErrorBoundary>
          <Providers>
            <LayoutWrapper>
              <ToastProvider>
                    {children}
              </ToastProvider>
            
            </LayoutWrapper>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
