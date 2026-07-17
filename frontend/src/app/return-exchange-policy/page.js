import ReturnContent from './ReturnContent';

export const metadata = {
  title: 'Return & Exchange Policy | AA Neddles — Pakistani Luxury Fashion',
  description:
    'AA Neddles hassle-free return and exchange policy. Easy returns within 14 days. Learn about our return process, eligibility, and refund policy.',
  openGraph: {
    title: 'Return & Exchange Policy | AA Neddles',
    description:
      'AA Neddles hassle-free return and exchange policy. Easy returns within 14 days.',
    url: 'https://aaneddles.com/return-exchange-policy',
    siteName: 'AA Neddles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Return & Exchange Policy | AA Neddles',
    description:
      'AA Neddles hassle-free return and exchange policy. Easy returns within 14 days.',
  },
};

export default function ReturnPage() {
  return <ReturnContent />;
}
