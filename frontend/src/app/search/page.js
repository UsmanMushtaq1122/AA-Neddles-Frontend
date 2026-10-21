import PageLayout from '@/components/PageLayout';
import SearchPageContent from './SearchPageContent';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || '';
  if (!q) {
    return { title: 'Search — AA Needles', description: 'Search our collections for the perfect outfit.' };
  }
  return {
    title: `"${q}" Search Results — AA Needles`,
    description: `Browse search results for "${q}" at AA Needles. Find your perfect outfit from our luxury collection.`,
  };
}

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
