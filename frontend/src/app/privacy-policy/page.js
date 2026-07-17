import PrivacyContent from './PrivacyContent';

export const metadata = {
  title: 'Privacy Policy | AA Neddles — Pakistani Luxury Fashion',
  description:
    'AA Neddles privacy policy. Learn how we collect, use, and protect your personal information when you shop with us.',
  openGraph: {
    title: 'Privacy Policy | AA Neddles',
    description:
      'Learn how AA Neddles collects, uses, and protects your personal information.',
    url: 'https://aaneddles.com/privacy-policy',
    siteName: 'AA Neddles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | AA Neddles',
    description:
      'Learn how AA Neddles collects, uses, and protects your personal information.',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
