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
import GoogleAuthProvider from '@/components/GoogleAuthProvider';
import MarketingConsent from '@/components/MarketingConsent';

const playfair = { variable: '--font-heading' };
const inter = { variable: '--font-body' };
const cormorant = { variable: '--font-logo' };

export const metadata = {
  title: 'AA Needles — Pakistani Luxury Fashion',
  description: 'Discover premium Pakistani fashion at AA Needles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
  metadataBase: new URL('https://aaneedles.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AA Needles — Pakistani Luxury Fashion',
    description: 'Discover premium Pakistani fashion at AA Needles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
    url: 'https://aaneedles.com/',
    siteName: 'AA Needles',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: 'AA NEEDLES official logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AA Needles — Pakistani Luxury Fashion',
    description: 'Discover premium Pakistani fashion at AA Needles. Shop ready-to-wear, formal, and bridal collections crafted with exquisite detail.',
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
              '@id': 'https://aaneedles.com/#organization',
              name: 'AA NEEDLES',
              alternateName: 'AA Needles',
              url: 'https://aaneedles.com/',
              sameAs: [
                'https://www.instagram.com/aaneedlesofficial/',
                'https://facebook.com/aaneddles',
                'https://www.tiktok.com/@aaneedlesofficial',
              ],
              logo: {
                '@type': 'ImageObject',
                url: 'https://aaneedles.com/logo.png',
                contentUrl: 'https://aaneedles.com/logo.png',
                width: 1024,
                height: 1024,
              },
              description: 'Pakistani luxury fashion brand offering ready-to-wear, formal, and bridal collections.',
              address: { '@type': 'PostalAddress', addressCountry: 'PK' },
            })
          }}
        />
        <GoogleAuthProvider>
          <StoreProvider>
            <Header />
            <main id="main-content" className="flex-1"><ClientErrorBoundary>{children}</ClientErrorBoundary></main>
            <ClientErrorBoundary><NewsletterSection /></ClientErrorBoundary>
            <ClientErrorBoundary><Footer /></ClientErrorBoundary>
            <CartDrawer />
            <BottomNavigation />
            <ToastContainer />
            <Analytics />
            <MarketingConsent />
          </StoreProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
