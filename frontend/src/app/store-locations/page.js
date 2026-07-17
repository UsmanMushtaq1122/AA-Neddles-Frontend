import PageLayout from '@/components/PageLayout';
import { MapPin, Phone, Clock } from 'lucide-react';

export const metadata = {
  title: 'Store Locations — AA Neddles',
  description:
    'Find AA Neddles stores near you. Visit our flagship outlets across Pakistan for an immersive shopping experience.',
  openGraph: {
    title: 'Store Locations — AA Neddles',
    description: 'Find AA Neddles stores near you.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Store Locations — AA Neddles',
    description: 'Find AA Neddles stores near you.',
  },
};

const stores = [
  {
    name: 'AA Neddles — Flagship Store',
    address: '23-C, Commercial Area, Phase 5, DHA',
    city: 'Lahore',
    phone: '+92 42 3569 1234',
    hours: '10:00 AM — 9:00 PM',
  },
  {
    name: 'AA Neddles — Clifton',
    address: 'Block 5, Clifton Commercial Boulevard',
    city: 'Karachi',
    phone: '+92 21 3587 5678',
    hours: '10:00 AM — 9:00 PM',
  },
  {
    name: 'AA Neddles — F-7',
    address: 'F-7 Markaz, Jinnah Super Market',
    city: 'Islamabad',
    phone: '+92 51 2653 4321',
    hours: '10:00 AM — 9:00 PM',
  },
];

export default function StoreLocationsPage() {
  return (
    <PageLayout
      title="Store Locations"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Store Locations' },
      ]}
    >
      <div className="py-8">
        <p className="text-noor-gray text-sm mb-10 max-w-2xl">
          Visit us in person for a premium shopping experience. Our knowledgeable staff will help you find the perfect outfit.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.city}
              className="border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="ty-h4 text-noor-black mb-4">{store.name}</h3>
              <div className="space-y-3 text-sm text-zinc-600">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-noor-maroon mt-0.5 shrink-0" />
                  <span>{store.address}, {store.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-noor-maroon shrink-0" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-noor-maroon shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
