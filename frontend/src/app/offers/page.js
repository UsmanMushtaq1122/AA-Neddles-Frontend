import PageLayout from '@/components/PageLayout';
import OffersPageContent from './OffersPageContent';

export const metadata = {
  title: 'Offers — AA Needles',
  description: 'Explore exclusive offers and sale items at AA Needles.',
  openGraph: {
    title: 'Offers — AA Needles',
    description: 'Explore exclusive offers and sale items at AA Needles.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Offers — AA Needles',
    description: 'Explore exclusive offers and sale items at AA Needles.',
  },
};

export default function OffersPage() {
  return (
    <PageLayout
      title="Offers"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Offers' },
      ]}
    >
      <OffersPageContent />
    </PageLayout>
  );
}
