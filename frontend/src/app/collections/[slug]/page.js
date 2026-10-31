'use client';

import { use } from 'react';
import CollectionBrowser from '@/components/CollectionBrowser';

export default function CollectionPage({ params }) {
  const { slug } = use(params);
  return <CollectionBrowser slug={slug} />;
}

