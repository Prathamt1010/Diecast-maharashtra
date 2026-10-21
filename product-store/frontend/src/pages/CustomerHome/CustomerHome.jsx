import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  PackageCheck,
  Headphones,
} from "lucide-react";

import { getCategories } from "../../api/categoryApi";

import CustomerNavbar from "../../components/CustomerNavbar/CustomerNavbar";
import CustomerPackingProcess from "../../components/CustomerPackingProcess";
import CustomerTestimonials from "../../components/CustomerTestimonials";

import "./customerHome.css";

/* =========================================
   CONTENT
========================================= */

/*
  HERO SLIDES
  - Put your images in /public/images/
  - Only images that actually exist are used, so you can leave all three
    listed here and simply add hero-car-2.png / hero-car-3.png later.
  - With 2+ images the hero rotates automatically, with a yellow
    "speed sweep" transition between them.
*/
const HERO_SLIDES = [
  { src: "/images/hero-car.png", label: "Rare collection" },
  { src: "/images/hero-car-2.png", label: "New arrivals" },
  { src: "/images/hero-car-3.png", label: "Collector favourites" },
];

const SLIDE_INTERVAL = 6500; // ms per slide

const TICKER_ITEMS = [
  "Real cars. Miniature souls.",
  "Premium diecast collection",
  "Made for collectors and enthusiasts",
];

// Repeated so one ticker group is always wider than the screen
const TICKER_LOOP = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Quality Models",
    text: "Carefully selected diecast models with attention to detail and finish.",
  },
  {
    icon: PackageCheck,
    title: "Carefully Packed",
    text: "Your collection deserves proper care from our store to your hands.",
  },
  {
    icon: Headphones,
    title: "Collector Support",
    text: "Have a question about a model? We're here to help.",
  },
];

const pad = (number) => String(number).padStart(2, "0");

/* =========================================
   COMPONENT
========================================= */

const CustomerHome = () => {
  /* ---------- Categories ---------- */

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const data = await getCategories();

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setCategoriesError("Unable to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  /* ---------- Hero slideshow ---------- */

  // Slides whose image files really exist (filled in after a quick preload)
  const [slides, setSlides] = useState([HERO_SLIDES[0]]);
  const [active, setActive] = useState(0);

  // Image layers currently in the DOM (the one leaving + the one arriving)
  const [layers, setLayers] = useState([
    { id: 0, src: HERO_SLIDES[0].src, wipe: false },
  ]);

  const layerId = useRef(0);
  const touchStartX = useRef(null);

  // Preload every slide, keep only the ones that load
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      HERO_SLIDES.map(
        (slide) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(slide);
            img.onerror = () => resolve(null);
            img.src = slide.src;
          })
      )
    ).then((results) => {
      if (cancelled) return;

      const loaded = results.filter(Boolean);
      if (loaded.length === 0) return;

      // If the first image is missing, swap in the first one that exists
      if (loaded[0].src !== HERO_SLIDES[0].src) {
        layerId.current += 1;
        setLayers([{ id: layerId.current, src: loaded[0].src, wipe: false }]);
      }

      setSlides(loaded);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback(
    (index) => {
      if (slides.length < 2) return;

      const target = (index + slides.length) % slides.length;
      if (target === active) return;

      layerId.current += 1;
      const id = layerId.current;

      setActive(target);
      setLayers((previous) => [
        previous[previous.length - 1],
        { id, src: slides[target].src, wipe: true },
      ]);
    },
    [slides, active]
  );

  // Autoplay (skipped when the visitor prefers reduced motion)
  useEffect(() => {
    if (slides.length < 2) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = setTimeout(() => goTo(active + 1), SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [active, slides.length, goTo]);

  // Swipe left / right on touch screens
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 60) return;

    goTo(deltaX < 0 ? active + 1 : active - 1);
  };

  const newestLayer = layers[layers.length - 1];

  return (
    <div className="customer-home">
      <CustomerNavbar />

      {/* =========================================
          HERO
      ========================================= */}

      <section
        className={`customer-hero${slides.length < 2 ? " is-single" : ""}`}
        aria-label="Featured collection"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-size background images */}
        <div className="customer-hero-media" aria-hidden="true">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`customer-hero-layer${layer.wipe ? " is-wipe" : ""}`}
            >
              <img src={layer.src} alt="" draggable="false" />
            </div>
          ))}

          <div className="customer-hero-shade" />
        </div>

        {/* Yellow streak that passes across when the image changes */}
        {newestLayer.wipe && (
          <span
            key={newestLayer.id}
            className="customer-hero-sweep"
            aria-hidden="true"
          />
        )}

        <div className="customer-hero-inner">
          <h1 className="customer-hero-title">
            <span className="customer-hero-line" style={{ "--i": 0 }}>
              <span>Premium</span>
            </span>
            <span className="customer-hero-line" style={{ "--i": 1 }}>
              <span>Diecast</span>
            </span>
            <span className="customer-hero-line" style={{ "--i": 2 }}>
              <span>Collection</span>
            </span>
          </h1>

          <p className="customer-hero-description">
            Discover beautifully crafted diecast cars made for collectors,
            enthusiasts and everyone who loves automobiles.
          </p>

          <div className="customer-hero-actions">
            <Link to="/shop" className="customer-primary-button">
              <span>Explore Collection</span>
            </Link>

            <Link to="/shop/categories" className="customer-secondary-button">
              <span>View Categories</span>
            </Link>
          </div>
        </div>

        {/* Slide controls (space is always reserved so nothing jumps) */}
        <div className="customer-hero-footer">
          {slides.length > 1 && (
            <>
              <span className="customer-hero-count">
                {pad(active + 1)}
                <i>/ {pad(slides.length)}</i>
              </span>

              <div
                className="customer-hero-segments"
                role="group"
                aria-label="Choose a slide"
              >
                {slides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    className={`customer-hero-segment${
                      index < active ? " is-done" : ""
                    }${index === active ? " is-active" : ""}`}
                    onClick={() => goTo(index)}
                    aria-label={`Show ${slide.label}`}
                    aria-current={index === active ? "true" : undefined}
                  >
                    <span
                      style={
                        index === active
                          ? { animationDuration: `${SLIDE_INTERVAL}ms` }
                          : undefined
                      }
                    />
                  </button>
                ))}
              </div>

              <p className="customer-hero-caption" key={active} aria-live="polite">
                {slides[active]?.label}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Ticker */}
      <div className="customer-ticker" aria-hidden="true">
        <div className="customer-ticker-track">
          {[0, 1].map((group) => (
            <div className="customer-ticker-group" key={group}>
              {TICKER_LOOP.map((item, index) => (
                <span
                  className="customer-ticker-item"
                  key={`${group}-${index}`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          CATEGORIES
      ========================================= */}

      <section className="customer-category-section">
        <div className="customer-section-header">
          <h2 className="customer-section-title">Shop by category</h2>

          <Link to="/shop/categories" className="customer-view-all">
            View all categories
          </Link>
        </div>

        <div className="customer-category-list">
          {categoriesLoading &&
            [0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="customer-category-skeleton"
                aria-hidden="true"
              />
            ))}

          {!categoriesLoading && categoriesError && (
            <div className="customer-category-message is-error" role="alert">
              <p>{categoriesError} Check your connection and try again.</p>
              <button type="button" onClick={loadCategories}>
                Try again
              </button>
            </div>
          )}

          {!categoriesLoading &&
            !categoriesError &&
            categories.length === 0 && (
              <div className="customer-category-message">
                <p>No categories available yet. Please check back soon.</p>
              </div>
            )}

          {!categoriesLoading &&
            !categoriesError &&
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="customer-category-row"
              >
                <h3 className="customer-category-name">{category.name}</h3>

                <p className="customer-category-desc">
                  {category.description || "Explore our collection"}
                </p>

                <span className="customer-category-arrow" aria-hidden="true">
                  <ArrowUpRight size={22} strokeWidth={2.4} />
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* =========================================
          PACKING PROCESS
      ========================================= */}

      <CustomerPackingProcess />

      {/* =========================================
          WHY CHOOSE US
      ========================================= */}

      <section className="customer-features-section">
        <div className="customer-section-header customer-features-header">
          <h2 className="customer-section-title">Built for collectors</h2>

          <p>
            We focus on quality, carefully selected models and a smooth buying
            experience for every collector.
          </p>
        </div>

        <div className="customer-features-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div className="customer-feature" key={title}>
              <span className="customer-feature-icon">
                <Icon size={22} strokeWidth={2.2} />
              </span>

              <h3>{title}</h3>

              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          TESTIMONIALS
      ========================================= */}

      <CustomerTestimonials />
    </div>
  );
};

export default CustomerHome;