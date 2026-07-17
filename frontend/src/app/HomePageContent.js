'use client';

import HeroBanner from '@/components/HeroBanner';
import NewArrival from '@/components/NewArrival';
import TrendingCarousel from '@/components/TrendingCarousel';
import TestimonialsPreview from '@/app/testimonials/TestimonialsPreview';

export default function HomePageContent() {
  return (
    <>
      <HeroBanner />
      <NewArrival />
      <TrendingCarousel />
      <TestimonialsPreview />
    </>
  );
}

