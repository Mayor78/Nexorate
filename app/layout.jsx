import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import Footer from '../app/components/layout/Footer';

export const metadata = {
  title: 'Nexorate - Buy, Sell & Connect',
  description: 'Africa\'s premium marketplace and personals platform. Buy, sell, swap gadgets, and connect effortlessly.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <LayoutWrapper>
          {children}
          <Footer  />
        </LayoutWrapper>
      </body>
    </html>
  );
}