"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const SLIDES = [
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
  const [index, setIndex]   = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef            = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef            = useRef(null);

  // Advance to next slide
  const goTo = useCallback((i) => {
    setIndex((prev) => (i + SLIDES.length) % SLIDES.length);
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
      setIndex((prev) => (prev + 1) % SLIDES.length);
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

  const slide = SLIDES[index];

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.eyebrow + i}
          className={`hero__slide ${i === index ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={i !== index}
        />
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
              ? (index + 1) % SLIDES.length
              : (index - 1 + SLIDES.length) % SLIDES.length;
            goTo(nextIdx);
            e.currentTarget.children[nextIdx]?.focus();
          }
        }}
      >
        {SLIDES.map((s, i) => (
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
