'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { locationsApi } from '@/services/locations';
import { MapPin, Phone, Clock, Loader2 } from 'lucide-react';

export default function StoreLocationsPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationsApi.getAll()
      .then((res) => {
        const data = res.data || [];
        setStores(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Store Locations"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Store Locations' },
      ]}
    >
      <div className="py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-noor-maroon" />
          </div>
        ) : (
          <>
            <p className="text-noor-gray text-sm mb-10 max-w-2xl">
              Visit us in person for a premium shopping experience. Our knowledgeable staff will help you find the perfect outfit.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {stores.map((store, i) => (
                <div
                  key={store.id || i}
                  className="border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="ty-h4 text-noor-black mb-4">{store.name}</h3>
                  <div className="space-y-3 text-sm text-zinc-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-noor-maroon mt-0.5 shrink-0" />
                      <span>{store.address}{store.city ? `, ${store.city}` : ''}</span>
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
            {stores.length === 0 && !loading && (
              <p className="text-center text-sm text-noor-gray py-8">No store locations available at this time.</p>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
