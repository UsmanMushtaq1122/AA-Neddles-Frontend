import PageLayout from '@/components/PageLayout';
import OffersPageContent from './OffersPageContent';

export const metadata = {
  title: 'Offers — AA Neddles',
  description: 'Explore exclusive offers and sale items at AA Neddles.',
  openGraph: {
    title: 'Offers — AA Neddles',
    description: 'Explore exclusive offers and sale items at AA Neddles.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Offers — AA Neddles',
    description: 'Explore exclusive offers and sale items at AA Neddles.',
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
