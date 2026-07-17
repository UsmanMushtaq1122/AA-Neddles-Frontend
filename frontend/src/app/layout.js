import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import CartDrawer from '@/components/CartDrawer';
import ToastContainer from '@/components/Toast';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import StoreProvider from '@/store/StoreProvider';


const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'AA Neddles — Pakistani Luxury Fashion',
  description: 'Discover premium Pakistani fashion at AA Neddles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-noor-black antialiased">
        <StoreProvider>
          <Header />
          <main id="main-content" className="flex-1"><ClientErrorBoundary>{children}</ClientErrorBoundary></main>
          <ClientErrorBoundary><NewsletterSection /></ClientErrorBoundary>
          <ClientErrorBoundary><Footer /></ClientErrorBoundary>
          <CartDrawer />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}

