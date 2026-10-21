import HomePageContent from './HomePageContent';

export const metadata = {
  title: 'AA Needles — Pakistani Luxury Fashion',
  description:
    'Discover premium Pakistani fashion at AA Needles. Explore luxury formals, bridal collections, pret, and unstitched fabrics crafted with exquisite detail and timeless elegance.',
  openGraph: {
    title: 'AA Needles — Pakistani Luxury Fashion',
    description:
      'Discover premium Pakistani fashion at AA Needles. Luxury formals, bridal, pret & unstitched collections.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AA Needles — Pakistani Luxury Fashion',
    description:
      'Discover premium Pakistani fashion at AA Needles. Luxury formals, bridal, pret & unstitched collections.',
  },
};

export default function Home() {
  return <HomePageContent />;
}
