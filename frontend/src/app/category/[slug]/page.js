
import CategoryPageContent from './CategoryPageContent';

const CATEGORY_META = {
  all: {
    title: 'All Products',
    description: 'Explore the complete AA Neddles collection — luxury pret,formals, bridal couture, menswear, kidswear, and handcrafted jewelry. Premium Pakistani fashion with nationwide delivery.',
    keywords: 'AA Neddles, Pakistani fashion, luxury pret, formal wear, bridal couture, menswear, kidswear, jewelry',
  },
  'ready-to-wear': {
    title: 'Ready to Wear',
    description: 'Shop AA Neddles ready-to-wear collection — luxury pret, unstitched suits, and new arrivals. Effortlessly elegant Pakistani fashion designed for the modern woman.',
    keywords: 'luxury pret Pakistan, unstitched suits, ready to wear Pakistani fashion, women clothing',
  },
  formal: {
    title: 'Formal Wear',
    description: 'Discover AA Neddles formal collection — luxury formals and couture pieces crafted with intricate embroidery and premium fabrics for weddings and special occasions.',
    keywords: 'luxury formals Pakistan, couture, formal Pakistani dresses, wedding wear',
  },

  kids: {
    title: 'Kids Collection',
    description: 'AA Neddles kidswear — adorable, premium clothing for children crafted with the same quality and attention to detail as our adult collections.',
    keywords: 'Pakistani kids clothing, children wear, kidswear Pakistan, luxury kids fashion',
  },
 
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] || {
    title: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Shop ${slug.replace(/-/g, ' ')} at AA Neddles. Premium Pakistani luxury fashion with exquisite craftsmanship and timeless elegance.`,
    keywords: `AA Neddles, ${slug.replace(/-/g, ' ')}, Pakistani luxury fashion`,
  };

  return {
    title: `${meta.title} — AA Neddles`,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${meta.title} — AA Neddles`,
      description: meta.description,
      type: 'website',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} — AA Neddles`,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];

  return (
    <>
      <script
        id="json-ld-breadcrumb-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aaneddles.com/' },
              { '@type': 'ListItem', position: 2, name: meta?.title || slug, item: `https://aaneddles.com/category/${slug}` },
            ],
          })
        }}
      />
      <CategoryPageContent slug={slug} />
    </>
  );
}
