import PageLayout from '@/components/PageLayout';
import SearchPageContent from './SearchPageContent';

export const metadata = {
  title: 'Search — AA Neddles',
  description: 'Search our collections for the perfect outfit.',
};

export default function SearchPage() {
  return (
    <PageLayout
      title="Search"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Search' },
      ]}
    >
      <SearchPageContent />
    </PageLayout>
  );
}
