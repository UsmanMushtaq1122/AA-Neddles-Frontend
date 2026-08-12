"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannersApi } from "@/services/banners";

const DEFAULT_slides = [
  {
    eyebrow: "NEW COLLECTION 2026",
    heading: "Elevate Your\nEveryday",
    body: "Timeless silhouettes crafted for the modern woman.",
    cta: "Shop Now",
    href: "/category/all",
    image: "/images/hero1.jpeg",
  },
  {
    eyebrow: "LIMITED EDITION",
    heading: "Threads of\nDistinction",
    body: "Hand-finished detailing, made to last a lifetime.",
    cta: "Discover More",
    href: "/category/formal",
    image: "/images/Hero2.jpeg",
  },
  {
    eyebrow: "THE ESSENTIALS EDIT",
    heading: "Quiet Luxury,\nLoudly Worn",
    body: "Foundational pieces that build an effortless wardrobe.",
    cta: "View Edit",
    href: "/category/ready-to-wear",
    image: "/images/Hero3.jpeg",
  },
  {
    eyebrow: "SUMMER FESTIVE 2026",
    heading: "Sun-Kissed\nElegance",
    body: "Flowing fabrics that celebrate the warmth of the season.",
    cta: "Explore Collection",
    href: "/category/unstitched",
    image: "/images/hero1.jpeg",
  },
  {
    eyebrow: "SIGNATURE FORMALS",
    heading: "Dressed for\nEvery Moment",
    body: "Impeccably tailored formal wear for the modern occasion.",
    cta: "Shop Formals",
    href: "/category/luxury-formals",
    image: "/images/Hero2.jpeg",
  },
  {
    eyebrow: "LUXURY PRET",
    heading: "Ready to\nInspire",
    body: "Premium pret wear blending tradition with contemporary flair.",
    cta: "View All",
    href: "/category/luxury-pret",
    image: "/images/Hero3.jpeg",
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroBanner() {
  const [slides, setSlides] = useState(DEFAULT_slides);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    bannersApi.getAll()
      .then((res) => {
        if (res.success && res.data?.length) {
          const mapped = res.data
            .filter((b) => b.type === "hero")
            .map((b, i) => ({
              eyebrow: b.subtitle || b.title || "",
              heading: b.title || "",
              body: b.subtitle || "",
              cta: b.buttonText || "Shop Now",
              href: b.link || "/",
              image: b.image || "/images/hero1.jpeg",
            }));
          if (mapped.length > 0) setSlides(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Advance to next slide
  const goTo = useCallback((i) => {
    setIndex((prev) => (i + slides.length) % slides.length);
    if (progressRef.current) {
      progressRef.current.style.transform = 'scaleX(0)';
    }
    startTimeRef.current = performance.now();
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance timer
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      if (progressRef.current) {
        progressRef.current.style.transform = 'scaleX(0)';
      }
      startTimeRef.current = performance.now();
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // Animate the progress bar via rAF — DOM only, no state
  useEffect(() => {
    if (paused) return;
    startTimeRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${pct})`;
      }
      if (elapsed < AUTOPLAY_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, index]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  const slide = slides[index] || DEFAULT_slides[0] || {};

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.eyebrow + i}
          className={`hero__slide ${i === index ? "is-active" : ""}`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt={s.heading ? `${s.heading.replace(/\n/g, ' ')} — ${s.eyebrow}` : 'AA Neddles Collection'}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Gradient scrim */}
      <div className="hero__scrim" />

      {/* Text content */}
      <div className="hero__content" key={slide.eyebrow + index}>
        <p className="hero__eyebrow">{slide.eyebrow}</p>
        <h1 className="hero__heading">
          {slide.heading.split("\n").map((line) => (
            <span key={line} className="hero__heading-line">{line}</span>
          ))}
        </h1>
        <p className="hero__body">{slide.body}</p>
        <Link href={slide.href} className="hero__cta">{slide.cta}</Link>
      </div>



      {/* ── Progress Bar Indicators ─────────────── */}
      <div
        className="hero__progress-wrap"
        role="tablist"
        aria-label="Select slide"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const nextIdx = e.key === 'ArrowRight'
              ? (index + 1) % slides.length
              : (index - 1 + slides.length) % slides.length;
            goTo(nextIdx);
            e.currentTarget.children[nextIdx]?.focus();
          }
        }}
      >
        {slides.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            tabIndex={i === index ? 0 : -1}
            className={`hero__progress-bar ${i === index ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            type="button"
          >
            {/* Animated fill overlay for the active bar */}
            {i === index && (
              <span
                ref={progressRef}
                className="hero__progress-fill"
                style={{ transform: 'scaleX(0)' }}
              />
            )}
            {/* Completed bar is fully white */}
            {i < index && (
              <span className="hero__progress-fill" style={{ transform: "scaleX(1)" }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
