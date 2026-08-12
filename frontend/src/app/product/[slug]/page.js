
import { notFound } from 'next/navigation';
import { productsApi } from '@/services/products';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/products/slug/${slug}`, { cache: 'no-store' });
    const data = await res.json();
    product = data.data;
  } catch {}

  if (!product) {
    return {
      title: 'Product Not Found — AA Neddles',
      description: 'The product you are looking for does not exist.',
    };
  }

  const categoryLabel = product.category?.name || '';

  return {
    title: `${product.name} — AA Neddles`,
    description: product.description?.slice(0, 160) || `Shop ${product.name} from AA Neddles. Premium Pakistani luxury fashion.`,
    openGraph: {
      title: `${product.name} — AA Neddles`,
      description: product.description?.slice(0, 160) || `Shop ${product.name} from AA Neddles.`,
      type: 'website',
      images: product.images?.[0] ? [{ url: typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || product.images[0]) }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — AA Neddles`,
      description: product.description?.slice(0, 160) || `Shop ${product.name} from AA Neddles.`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/products/slug/${slug}`, { cache: 'no-store' });
    const data = await res.json();
    product = data.data;
  } catch {}

  if (!product) {
    notFound();
  }

  const { default: ProductPageContent } = await import('./ProductPageContent');

  return (
    <>
      {product && (
        <script
          id="json-ld-product"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              description: product.description?.slice(0, 500),
              image: product.images?.map((i) => i.url || i) || [],
              sku: product.sku,
              brand: { '@type': 'Brand', name: 'AA Neddles' },
              offers: {
                '@type': 'Offer',
                url: `https://aaneddles.com/product/${slug}`,
                priceCurrency: 'PKR',
                price: product.salePrice || product.price,
                availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              },
            })
          }}
        />
      )}
      {product && (
        <script
          id="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aaneddles.com/' },
                ...(product.category?.slug ? [{ '@type': 'ListItem', position: 2, name: product.category.name, item: `https://aaneddles.com/category/${product.category.slug}` }] : []),
                { '@type': 'ListItem', position: product.category?.slug ? 3 : 2, name: product.name, item: `https://aaneddles.com/product/${slug}` },
              ],
            })
          }}
        />
      )}
      <ProductPageContent slug={slug} />
    </>
  );
}
