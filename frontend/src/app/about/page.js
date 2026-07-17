import AboutContent from './AboutContent';

export const metadata = {
  title: 'About Us — AA Neddles',
  description:
    'Learn about AA Neddles — redefining Pakistani fashion since 1999 with exquisite craftsmanship, premium fabrics, and timeless design.',
  openGraph: {
    title: 'About Us — AA Neddles',
    description:
      'Learn about AA Neddles — redefining Pakistani fashion since 1999.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — AA Neddles',
    description:
      'Learn about AA Neddles — redefining Pakistani fashion since 1999.',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
