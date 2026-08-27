"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannersApi } from "@/services/banners";

const AUTOPLAY_MS = 5500;

function getCloudinaryAutoUrl(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return url;
  if (url.includes("/upload/") && !url.includes("/upload/f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,c_fill,g_auto/");
  }
  return url;
}

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState("loading");

  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    bannersApi
      .getAll()
      .then((res) => {
        if (cancelled) return;
        const banners = Array.isArray(res?.data)
          ? res.data
            .filter((b) => b.type === "hero" && (b.image || b.optimizedImage))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          : [];
        if (cancelled) return;
        setIndex(0);
        setSlides(
          banners.map((b) => {
            const title = b.title || "";
            const subtitle = b.subtitle || "";
            let eyebrow = b.eyebrow || b.tagline || "";
            let body = subtitle;

            if (!eyebrow && subtitle) {
              if (subtitle.length <= 40 && subtitle !== title) {
                eyebrow = subtitle;
                body = "";
              }
            }

            return {
              id: b.id,
              eyebrow,
              heading: title,
              body,
              cta: b.buttonText || "Shop Now",
              href: b.link || "/",
              desktopImage: getCloudinaryAutoUrl(b.optimizedImage || b.image),
              mobileImage: getCloudinaryAutoUrl(
                b.mobileOptimizedImage ||
                b.mobileImage ||
                b.optimizedImage ||
                b.image
              ),
            };
          })
        );
        setStatus(banners.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback(
    (i) => {
      setIndex((prev) =>
        slides.length > 0 ? (i + slides.length) % slides.length : 0
      );
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(0)";
      }
      startTimeRef.current = performance.now();
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(0)";
      }
      startTimeRef.current = performance.now();
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
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
  }, [paused, index, slides.length]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 45;

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

  if (status !== "ready") {
    if (status === "loading") {
      return (
        <section className="hero" aria-label="Featured collections">
          <div className="absolute inset-0 bg-[#0c0c0c]" />
        </section>
      );
    }
    return null;
  }

  const slide = slides[index];

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
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id || `slide-${i}`}
            className={`hero__slide ${active ? "is-active" : ""}`}
            aria-hidden={!active}
          >
            <Image
              src={s.desktopImage}
              alt={
                s.heading
                  ? `${s.heading.replace(/\n/g, " ")}${s.eyebrow ? ` — ${s.eyebrow}` : ""}`
                  : "AA Neddles Collection"
              }
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 1px, 100vw"
              className="hero__img hero__img--desktop"
              decoding={i === 0 ? "sync" : "async"}
            />
            <Image
              src={s.mobileImage}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 1px"
              className="hero__img hero__img--mobile"
              decoding={i === 0 ? "sync" : "async"}
              aria-hidden="true"
            />
          </div>
        );
      })}

      <div className="hero__scrim" />

      <div className="hero__content" key={(slide.eyebrow || "") + index}>
        {slide.eyebrow ? <p className="hero__eyebrow">{slide.eyebrow}</p> : null}
        <h1 className="hero__heading">
          {slide.heading.split("\n").map((line) => (
            <span key={line} className="hero__heading-line">{line}</span>
          ))}
        </h1>
        {slide.body ? <p className="hero__body">{slide.body}</p> : null}
        <Link href={slide.href} className="hero__cta">{slide.cta}</Link>
      </div>

      {slides.length > 1 && (
        <div
          className="hero__progress-wrap"
          role="tablist"
          aria-label="Select slide"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const nextIdx =
                e.key === "ArrowRight"
                  ? (index + 1) % slides.length
                  : (index - 1 + slides.length) % slides.length;
              goTo(nextIdx);
              e.currentTarget.children[nextIdx]?.focus();
            }
          }}
        >
          {slides.map((s, i) => (
            <button
              key={s.id || `bar-${i}`}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              tabIndex={i === index ? 0 : -1}
              className={`hero__progress-bar ${i === index ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              type="button"
            >
              {i === index && (
                <span
                  ref={progressRef}
                  className="hero__progress-fill"
                  style={{ transform: "scaleX(0)" }}
                />
              )}
              {i < index && (
                <span className="hero__progress-fill" style={{ transform: "scaleX(1)" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

