
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getTestimonials } from "../api/testimonialApi";

import "./customerTestimonials.css";

const AUTOPLAY_MS = 7000;

// ===============================
// GET INITIALS
// ===============================
const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

// ===============================
// AVATAR
// ===============================
const Avatar = ({ name, src }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="customer-testimonial-avatar is-fallback">
        {initials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="customer-testimonial-avatar"
      onError={() => setFailed(true)}
    />
  );
};

// ===============================
// COMPONENT
// ===============================
const CustomerTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const touchStartX = useRef(null);

  // ===============================
  // FETCH TESTIMONIALS
  // ===============================
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTestimonials();

        console.log(
          "Testimonials API response:",
          response.data
        );

        setTestimonials(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch testimonials:",
          error
        );

        setError("Unable to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // ===============================
  // CHANGE ACTIVE TESTIMONIAL
  // ===============================
  const goTo = useCallback(
    (index) => {
      setActive(
        (index + testimonials.length) %
          testimonials.length
      );
    },
    [testimonials.length]
  );

  // ===============================
  // AUTOPLAY
  // ===============================
  useEffect(() => {
    if (testimonials.length < 2) {
      return undefined;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return undefined;
    }

    const timer = setTimeout(
      () => goTo(active + 1),
      AUTOPLAY_MS
    );

    return () => clearTimeout(timer);
  }, [
    active,
    goTo,
    testimonials.length,
  ]);

  // ===============================
  // TOUCH START
  // ===============================
  const handleTouchStart = (event) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  // ===============================
  // TOUCH END
  // ===============================
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return;
    }

    const deltaX =
      event.changedTouches[0].clientX -
      touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(deltaX) < 50) {
      return;
    }

    goTo(
      deltaX < 0
        ? active + 1
        : active - 1
    );
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <section className="customer-testimonials-section">
        <div className="customer-testimonials-header">
          <span className="customer-testimonials-eyebrow">
            <i aria-hidden="true" />
            What collectors say
          </span>

          <h2>Loved by collectors</h2>
        </div>

        <div className="customer-testimonials-stage">
          <div className="customer-testimonial-card">
            <p className="customer-testimonial-text">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ===============================
  // ERROR / EMPTY STATE
  // ===============================
  if (
    error ||
    testimonials.length === 0
  ) {
    return (
      <section className="customer-testimonials-section">
        <div className="customer-testimonials-header">
          <span className="customer-testimonials-eyebrow">
            <i aria-hidden="true" />
            What collectors say
          </span>

          <h2>Loved by collectors</h2>
        </div>

        <div className="customer-testimonials-stage">
          <div className="customer-testimonial-card">
            <p className="customer-testimonial-text">
              {error ||
                "No testimonials available."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ===============================
  // CURRENT TESTIMONIAL
  // ===============================
  const current = testimonials[active];

  // ===============================
  // UI
  // ===============================
  return (
    <section className="customer-testimonials-section">
      <div className="customer-testimonials-header">
        <span className="customer-testimonials-eyebrow">
          <i aria-hidden="true" />
          What collectors say
        </span>

        <h2>Loved by collectors</h2>
      </div>

      <div
        className="customer-testimonials-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* PREVIOUS BUTTON */}
        {testimonials.length > 1 && (
          <button
            type="button"
            className="customer-testimonial-nav prev"
            onClick={() =>
              goTo(active - 1)
            }
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              size={22}
              strokeWidth={2.4}
            />
          </button>
        )}

        {/* TESTIMONIAL CARD */}
        <div
          className="customer-testimonial-card"
          key={active}
        >
          <Quote
            className="customer-testimonial-quote-icon"
            size={34}
            strokeWidth={0}
            fill="currentColor"
            aria-hidden="true"
          />

          <p className="customer-testimonial-text">
            {current.quote}
          </p>

          {/* RATING */}
          <div
            className="customer-testimonial-rating"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  size={16}
                  strokeWidth={0}
                  fill={
                    index < current.rating
                      ? "currentColor"
                      : "#e4e1d6"
                  }
                  className={
                    index <
                    current.rating
                      ? "is-filled"
                      : "is-empty"
                  }
                />
              )
            )}
          </div>

          {/* CUSTOMER */}
          <div className="customer-testimonial-person">
            <Avatar
              name={current.name}
              src={current.avatar}
            />

            <span className="customer-testimonial-person-text">
              <strong>
                {current.name}
              </strong>

              <em>
                {current.location}
              </em>
            </span>
          </div>
        </div>

        {/* NEXT BUTTON */}
        {testimonials.length > 1 && (
          <button
            type="button"
            className="customer-testimonial-nav next"
            onClick={() =>
              goTo(active + 1)
            }
            aria-label="Next testimonial"
          >
            <ChevronRight
              size={22}
              strokeWidth={2.4}
            />
          </button>
        )}
      </div>

      {/* SEGMENTS */}
      {testimonials.length > 1 && (
        <div
          className="customer-testimonial-segments"
          role="group"
          aria-label="Choose a testimonial"
        >
          {testimonials.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                className={`customer-testimonial-segment${
                  index === active
                    ? " is-active"
                    : ""
                }`}
                onClick={() =>
                  goTo(index)
                }
                aria-label={`Show testimonial from ${item.name}`}
                aria-current={
                  index === active
                    ? "true"
                    : undefined
                }
              >
                <span
                  style={
                    index === active
                      ? {
                          animationDuration: `${AUTOPLAY_MS}ms`,
                        }
                      : undefined
                  }
                />
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default CustomerTestimonials;

