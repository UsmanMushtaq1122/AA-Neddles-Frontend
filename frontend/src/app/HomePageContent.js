'use client';

import HeroBanner from '@/components/HeroBanner';
import NewArrival from '@/components/NewArrival';
import Collections from '@/components/Collections';
import TrendingCarousel from '@/components/TrendingCarousel';
import TestimonialsPreview from '@/app/testimonials/TestimonialsPreview';

export default function HomePageContent() {
  return (
    <>
      <HeroBanner />
      <NewArrival />
      <Collections />
      <TrendingCarousel />
      <TestimonialsPreview />
    </>
  );
}
