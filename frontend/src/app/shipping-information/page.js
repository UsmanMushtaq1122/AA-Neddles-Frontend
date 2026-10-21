import ShippingContent from './ShippingContent';

export const metadata = {
  title: 'Shipping Information | AA Needles — Pakistani Luxury Fashion',
  description:
    'Learn about AA Needles shipping policies, delivery methods, processing times, and tracking for domestic and international orders.',
  openGraph: {
    title: 'Shipping Information | AA Needles',
    description:
      'Learn about AA Needles shipping policies, delivery methods, processing times, and tracking.',
    url: 'https://aaneddles.com/shipping-information',
    siteName: 'AA Needles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Information | AA Needles',
    description:
      'Learn about AA Needles shipping policies, delivery methods, processing times, and tracking.',
  },
};

export default function ShippingPage() {
  return <ShippingContent />;
}
