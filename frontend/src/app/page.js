import HomePageContent from './HomePageContent';

export const metadata = {
  title: "AA NEEDLES Official Website | Luxury Women's Clothing Pakistan",
  description:
    "Shop AA NEEDLES, a Pakistani women's fashion brand offering luxury formal, festive and casual ready-to-wear dresses. Explore our latest collections with worldwide shipping.",
  openGraph: {
    title: "AA NEEDLES Official Website | Luxury Women's Clothing Pakistan",
    description:
      "Shop AA NEEDLES, a Pakistani women's fashion brand offering luxury formal, festive and casual ready-to-wear dresses. Explore our latest collections with worldwide shipping.",
    type: 'website',
    url: '/',
    siteName: 'AA NEEDLES',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'AA NEEDLES official logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AA NEEDLES Official Website | Luxury Women's Clothing Pakistan",
    description:
      "Shop AA NEEDLES, a Pakistani women's fashion brand offering luxury formal, festive and casual ready-to-wear dresses. Explore our latest collections with worldwide shipping.",
    images: ['/logo.png'],
  },
};

export default function Home() {
  return <HomePageContent />;
}
