import productsData from '@/features/products/products.json';
import ProductPageContent from './ProductPageContent';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found — AA Neddles',
      description: 'The product you are looking for does not exist.',
    };
  }

  const categoryLabel = product.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${product.title} — AA Neddles`,
    description: product.description?.slice(0, 160) || `Shop ${product.title} from AA Neddles. Premium Pakistani luxury fashion.`,
    openGraph: {
      title: `${product.title} — AA Neddles`,
      description: product.description?.slice(0, 160) || `Shop ${product.title} from AA Neddles.`,
      type: 'website',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — AA Neddles`,
      description: product.description?.slice(0, 160) || `Shop ${product.title} from AA Neddles.`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductPageContent slug={slug} />;
}
