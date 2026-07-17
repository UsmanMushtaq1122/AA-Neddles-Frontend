'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles, Heart, Star, ShieldCheck, Award, Truck,
  RotateCcw, CreditCard, Headphones, TrendingUp, ArrowRight,
  Quote, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   SHARED ANIMATION VARIANTS
   ────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ──────────────────────────────────────────────
   ANIMATED SECTION WRAPPER
   ────────────────────────────────────────────── */
function Section({ children, className = '', ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ──────────────────────────────────────────────
   ANIMATED COUNTER
   ────────────────────────────────────────────── */
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════
   SECTION 1 — HERO BANNER
   ══════════════════════════════════════════════ */
function HeroBanner() {
  return (
    <section className="hero">
      {/* Background slide */}
      <div
        className="hero__slide is-active"
        style={{ backgroundImage: 'url(/images/hero1.jpeg)' }}
      />

      {/* Gradient scrim */}
      <div className="hero__scrim" />

      {/* Content — bottom-left like main hero */}
      <div className="hero__content">
        <p className="hero__eyebrow">About Our Brand</p>
        <h1 className="hero__heading">
          <span className="hero__heading-line">Crafting Elegance</span>
          <span className="hero__heading-line">for the Modern Woman</span>
        </h1>
        <p className="hero__body">
          Discover timeless fashion designed to celebrate confidence, beauty, and individuality.
        </p>
        <Link href="/category/all" className="hero__cta">
          Explore Collection
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 2 — BRAND STORY
   ══════════════════════════════════════════════ */
function BrandStory() {
  return (
    <Section className="py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:px-8 md:grid-cols-2 md:items-center">
        <motion.div variants={fadeUp} className="space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">About Us</p>
          <h2
            className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1.15] text-noor-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Redefining Fashion Through Innovation &amp; Elegance
          </h2>
          <div className="space-y-4 text-[15px] leading-[1.75] text-noor-muted">
            <p>
              Graduating from the Pakistan Institute of Fashion &amp; Design (PIFD) in 1998, AA Neddles set out to redefine Pakistan&apos;s retail fashion scene. What began in 1999 with a single outlet and small stitching unit has transformed into a prestigious brand recognized for impeccable craftsmanship and timeless design.
            </p>
            <p>
              Our collections celebrate heritage and modernity, bringing together embroidered luxury, premium pret, and curated formalwear for women who appreciate sophistication and detail. Every piece is thoughtfully designed to blend tradition with contemporary elegance.
            </p>
            <p>
              We believe fashion is more than clothing — it&apos;s a statement of identity, a celebration of culture, and an expression of the modern woman&apos;s confidence.
            </p>
          </div>
        </motion.div>
        <motion.div variants={scaleIn} className="relative">
          <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <Image
              src="/images/AA3.jpeg"
              alt="AA Neddles brand story"
              width={600}
              height={800}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-[#C9A27E] px-6 py-4 text-white shadow-lg max-md:hidden">
            <p className="text-[22px] font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Since 1999</p>
            <p className="text-[12px] uppercase tracking-wider text-white/80">25+ Years of Legacy</p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 3 — IMAGE STORY GRID
   ══════════════════════════════════════════════ */
function ImageStoryGrid() {
  return (
    <Section className="bg-[#F8F8F8] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">Our Craft</p>
            <h2
              className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.15] text-noor-black"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Where Tradition Meets Modern Artistry
            </h2>
            <p className="text-[15px] leading-[1.75] text-noor-muted">
              Every stitch tells a story. Our artisans blend time-honored techniques with contemporary design to create pieces that are both wearable and extraordinary. From selecting the finest fabrics to the final embellishment, our process is a testament to the art of fashion.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-[24px] font-semibold text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>500+</p>
                <p className="text-[13px] text-noor-muted">Artisans & Craftsmen</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-[24px] font-semibold text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>100%</p>
                <p className="text-[13px] text-noor-muted">Quality Tested</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={scaleIn} className="grid gap-6">
            <div className="overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/AA5.jpeg"
                alt="Craftsmanship"
                width={600}
                height={750}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/AA7.jpeg"
                alt="Premium fabrics"
                width={600}
                height={400}
                className="aspect-[3/2] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 4 — COMPANY STATS
   ══════════════════════════════════════════════ */
function CompanyStats() {
  const stats = [
    { value: 25, suffix: '+', label: 'Years', sub: 'Leading the Industry' },
    { value: 99, suffix: '.9%', label: '', sub: 'Customer Satisfaction' },
    { value: 200, suffix: 'K+', label: '', sub: 'Happy Customers' },
    { value: 1000, suffix: '+', label: '', sub: 'Products Delivered' },
  ];

  return (
    <Section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group flex flex-col items-center justify-center rounded-3xl bg-[#F7F7F7] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:h-[180px]"
            >
              <p className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-[13px] font-medium uppercase tracking-wider text-noor-muted">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 5 — OUR VALUES
   ══════════════════════════════════════════════ */
function OurValues() {
  const values = [
    {
      icon: <Award size={28} className="text-[#C9A27E]" />,
      title: 'Quality Craftsmanship',
      desc: 'Every garment is meticulously crafted using premium fabrics and time-honored techniques, ensuring exceptional quality in every stitch.',
    },
    {
      icon: <Heart size={28} className="text-[#C9A27E]" />,
      title: 'Customer First',
      desc: 'Our customers are at the heart of everything we do. We are committed to delivering an unparalleled shopping experience.',
    },
    {
      icon: <Sparkles size={28} className="text-[#C9A27E]" />,
      title: 'Innovation & Design',
      desc: 'We continuously push boundaries, blending heritage aesthetics with contemporary design to create fashion that inspires.',
    },
  ];

  return (
    <Section className="bg-[#F8F8F8] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">What We Stand For</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Values
          </h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group rounded-3xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F8F8] transition-colors duration-300 group-hover:bg-[#C9A27E]/10">
                {v.icon}
              </div>
              <h3 className="mb-3 text-[17px] font-semibold text-noor-black">{v.title}</h3>
              <p className="text-[14px] leading-relaxed text-noor-muted">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 6 — OUR JOURNEY TIMELINE
   ══════════════════════════════════════════════ */
function JourneyTimeline() {
  const milestones = [
    { year: '1999', title: 'Brand Founded', desc: 'Started with a single outlet and a vision for premium fashion.' },
    { year: '2005', title: 'First Collection Launch', desc: 'Launched our signature embroidered luxury collection.' },
    { year: '2012', title: '10,000 Customers', desc: 'Reached the milestone of serving 10,000 satisfied customers.' },
    { year: '2019', title: 'National Expansion', desc: 'Expanded across Pakistan with multiple flagship stores.' },
    { year: '2024', title: 'Premium Fashion Brand', desc: 'Recognized as one of Pakistan\'s leading luxury fashion houses.' },
  ];

  return (
    <Section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">Our Story</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Journey
          </h2>
        </motion.div>

        {/* Desktop horizontal */}
        <div className="relative hidden md:block">
          <div className="absolute top-[28px] left-0 right-0 h-px bg-noor-lightgray" />
          <div className="grid grid-cols-5 gap-6">
            {milestones.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="relative text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A27E] bg-white text-[13px] font-semibold text-[#C9A27E]">
                  {m.year}
                </div>
                <h4 className="mb-2 text-[15px] font-semibold text-noor-black">{m.title}</h4>
                <p className="text-[13px] leading-relaxed text-noor-muted">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="relative md:hidden">
          <div className="absolute top-0 bottom-0 left-[26px] w-px bg-noor-lightgray" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-5">
                <div className="relative z-10 flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A27E] bg-white text-[11px] font-semibold text-[#C9A27E]">
                  {m.year}
                </div>
                <div className="pt-1">
                  <h4 className="mb-1 text-[15px] font-semibold text-noor-black">{m.title}</h4>
                  <p className="text-[13px] leading-relaxed text-noor-muted">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 7 — TESTIMONIALS
   ══════════════════════════════════════════════ */
function Testimonials() {
  const [current, setCurrent] = useState(0);
  const testimonials = [
    {
      name: 'Ayesha Khan',
      city: 'Lahore',
      rating: 5,
      text: 'AA Neddles has completely transformed my wardrobe. The quality of their fabrics and the attention to detail in every piece is unmatched. I feel confident and elegant every time I wear their designs.',
      image: '/images/AA1.jpeg',
    },
    {
      name: 'Fatima Riaz',
      city: 'Karachi',
      rating: 5,
      text: 'The luxury formal collection exceeded all my expectations. The embroidery work is breathtaking, and the fit is perfect. AA Neddles is my go-to for every special occasion.',
      image: '/images/AA4.jpeg',
    },
    {
      name: 'Sana Malik',
      city: 'Islamabad',
      rating: 5,
      text: 'From the moment I walked into their store, I knew I was experiencing something special. Their customer service is exceptional, and the quality of their unstitched collections is premium.',
      image: '/images/AA6.jpeg',
    },
  ];

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <Section className="bg-noor-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">Testimonials</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>
            What Our Customers Say
          </h2>
        </motion.div>

        <motion.div variants={fadeUp} className="grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
            <Image
              src={testimonials[current].image}
              alt={testimonials[current].name}
              width={500}
              height={650}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <Quote size={36} className="text-[#C9A27E]/40" />
            <p className="text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.8] text-noor-black italic">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>
            <div className="flex gap-1">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#C9A27E] text-[#C9A27E]" />
              ))}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-noor-black">{testimonials[current].name}</p>
              <p className="text-[13px] text-noor-muted">{testimonials[current].city}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-noor-lightgray transition-all hover:border-noor-black hover:bg-noor-black hover:text-white" aria-label="Previous testimonial">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-noor-lightgray transition-all hover:border-noor-black hover:bg-noor-black hover:text-white" aria-label="Next testimonial">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 8 — WHY CHOOSE US
   ══════════════════════════════════════════════ */
function WhyChooseUs() {
  const features = [
    { icon: <ShieldCheck size={22} />, label: 'Premium Quality' },
    { icon: <Truck size={22} />, label: 'Fast Delivery' },
    { icon: <RotateCcw size={22} />, label: 'Easy Returns' },
    { icon: <CreditCard size={22} />, label: 'Secure Payments' },
    { icon: <Headphones size={22} />, label: 'Customer Support' },
    { icon: <TrendingUp size={22} />, label: 'Latest Fashion Trends' },
  ];

  return (
    <Section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]">The AA Neddles Promise</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium text-noor-black" style={{ fontFamily: 'var(--font-heading)' }}>
            Why Choose Us
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-noor-lightgray bg-white p-6 text-center transition-all duration-300 hover:border-[#C9A27E] hover:shadow-[0_8px_24px_rgba(201,162,126,0.12)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-noor-cream text-[#C9A27E] transition-colors duration-300 group-hover:bg-[#C9A27E] group-hover:text-white">
                {f.icon}
              </div>
              <p className="text-[13px] font-medium text-noor-black">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   SECTION 9 — CALL TO ACTION
   ══════════════════════════════════════════════ */
function CallToAction() {
  return (
    <Section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0">
        <Image src="/images/Hero2.jpeg" alt="CTA background" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-noor-dark/80 via-noor-dark/60 to-noor-dark/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          variants={fadeUp}
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A27E]"
        >
          Start Your Journey
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto max-w-3xl text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.15] text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Discover Your Signature Style
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/70"
        >
          Explore our latest collections crafted with elegance and sophistication.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-noor-black transition-all duration-300 hover:bg-[#C9A27E] hover:text-white"
          >
            Shop Now
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            View Collections
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════════════
   MAIN ABOUT PAGE
   ══════════════════════════════════════════════ */
export default function AboutContent() {
  return (
    <div className="pt-[62px]">
      <HeroBanner />
      <BrandStory />
      <ImageStoryGrid />
      <CompanyStats />
      <OurValues />
      <JourneyTimeline />
      <Testimonials />
      <WhyChooseUs />
      <CallToAction />
    </div>
  );
}
