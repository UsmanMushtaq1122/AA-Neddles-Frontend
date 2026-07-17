const baseUrl = 'https://aaneddles.com';

const routes = [
  '/',
  '/about',
  '/contact',
  '/faqs',
  '/terms',
  '/privacy-policy',
  '/return-exchange-policy',
  '/shipping-information',
  '/store-locations',
  '/careers',
  '/testimonials',
  '/login',
  '/register',
  '/order-tracking',
  '/category/all',
  '/category/ready-to-wear',
  '/category/formal',
  '/category/bridal',
  '/category/kids',
  '/category/men',
  '/category/accessories',
];

export default function sitemap() {
  const now = new Date().toISOString();

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 1.0 : route.startsWith('/category') ? 0.8 : 0.6,
    })),
  ];
}
