import FAQContent from './FAQContent';

export const metadata = {
  title: 'FAQs | AA Neddles — Pakistani Luxury Fashion',
  description:
    'Find answers to frequently asked questions about AA Neddles — ordering, shipping, returns, payments, account management, and more.',
  openGraph: {
    title: 'FAQs | AA Neddles',
    description:
      'Find answers to frequently asked questions about AA Neddles — ordering, shipping, returns, payments, and more.',
    url: 'https://aaneddles.com/faqs',
    siteName: 'AA Neddles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs | AA Neddles',
    description:
      'Find answers to frequently asked questions about AA Neddles — ordering, shipping, returns, payments, and more.',
  },
};

export default function FAQPage() {
  return <FAQContent />;
}
