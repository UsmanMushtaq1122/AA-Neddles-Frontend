import { GoogleOAuthProvider } from '@react-oauth/google';

import './globals.css';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import CartDrawer from '@/components/CartDrawer';
import ToastContainer from '@/components/Toast';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import StoreProvider from '@/store/StoreProvider';
import Analytics from '@/components/Analytics';

const playfair = { variable: '--font-heading' };
const inter = { variable: '--font-body' };
const cormorant = { variable: '--font-logo' };

export const metadata = {
  title: 'AA Neddles — Pakistani Luxury Fashion',
  description: 'Discover premium Pakistani fashion at AA Neddles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
  metadataBase: new URL('https://aaneddles.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AA Neddles — Pakistani Luxury Fashion',
    description: 'Discover premium Pakistani fashion at AA Neddles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
    url: 'https://aaneddles.com',
    siteName: 'AA Neddles',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AA Neddles — Pakistani Luxury Fashion',
    description: 'Discover premium Pakistani fashion at AA Neddles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#F5F0EB]/10 text-noor-black antialiased">
        <script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AA Neddles',
              url: 'https://aaneddles.com',
              logo: 'https://aaneddles.com/logo.png',
              description: 'Pakistani luxury fashion brand offering ready-to-wear, formal, and bridal collections.',
              address: { '@type': 'PostalAddress', addressCountry: 'PK' },
            })
          }}
        />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <StoreProvider>
            <Header />
            <main id="main-content" className="flex-1"><ClientErrorBoundary>{children}</ClientErrorBoundary></main>
            <ClientErrorBoundary><NewsletterSection /></ClientErrorBoundary>
            <ClientErrorBoundary><Footer /></ClientErrorBoundary>
            <CartDrawer />
            <BottomNavigation />
            <ToastContainer />
            <Analytics />
          </StoreProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

