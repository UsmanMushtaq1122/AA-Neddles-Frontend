const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const baseUrl = 'https://aaneddles.com';

const staticRoutes = [
  '/', '/about', '/contact', '/faqs', '/terms', '/privacy-policy',
  '/return-exchange-policy', '/shipping-information', '/store-locations',
  '/careers', '/testimonials', '/login', '/register', '/order-tracking',
];

export default async function sitemap() {
  const now = new Date().toISOString();

  let categorySlugs = [];
  try {
    const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const body = await res.json();
      const cats = body.data || body.categories || body.results || (Array.isArray(body) ? body : []);
      categorySlugs = cats.map((c) => c.slug || '').filter(Boolean);
    }
  } catch {}

  const allRoutes = [
    ...staticRoutes,
    ...categorySlugs.map((slug) => `/category/${slug}`),
  ];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1.0 : route.startsWith('/category') ? 0.8 : 0.6,
  }));
}
