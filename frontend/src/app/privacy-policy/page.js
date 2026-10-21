import PrivacyContent from './PrivacyContent';

export const metadata = {
  title: 'Privacy Policy | AA Needles — Pakistani Luxury Fashion',
  description:
    'AA Needles privacy policy. Learn how we collect, use, and protect your personal information when you shop with us.',
  openGraph: {
    title: 'Privacy Policy | AA Needles',
    description:
      'Learn how AA Needles collects, uses, and protects your personal information.',
    url: 'https://aaneddles.com/privacy-policy',
    siteName: 'AA Needles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | AA Needles',
    description:
      'Learn how AA Needles collects, uses, and protects your personal information.',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
