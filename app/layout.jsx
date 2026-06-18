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
  title: 'Nexorate - Buy, Sell & Connect',
  description: "Africa's premium marketplace and personals platform. Buy, sell, swap gadgets, and connect effortlessly.",
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
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
