export const WHATSAPP_BUSINESS_NUMBER = '923076916882';

export function createWhatsAppOrderUrl(product, { size, baseUrl = window.location.origin } = {}) {
  const productName = product.title || product.name || 'Product';
  const productSlug = product.slug || product.id;
  const price = product.salePrice ?? product.price;
  const productUrl = new URL(`/product/${encodeURIComponent(productSlug)}`, baseUrl).toString();
  const priceLabel = price == null ? 'Price not listed' : `Rs. ${Number(price).toLocaleString()} (PKR)`;
  const message = [
    'Hello AA NEEDLES! I am interested in ordering this product.',
    '',
    `Product: ${productName}`,
    `Price: ${priceLabel}`,
    ...(size ? [`Size: ${size}`] : []),
    `Product Link: ${productUrl}`,
    '',
    'Please share the ordering details.',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}
