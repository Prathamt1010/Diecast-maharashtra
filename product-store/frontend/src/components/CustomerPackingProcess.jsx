import React, { useEffect, useRef, useState } from "react";

import "./customerPackingProcess.css";

/*
  PACKING STEPS
  - Replace each `image` with your own photo in /public/images/.
  - Feel free to edit the title/description text, or add/remove steps —
    the layout (and alternating left/right pattern) adjusts automatically.
*/
const PACKING_STEPS = [
  {
    step: "01",
    title: "Quality check",
    description:
      "Every diecast model is inspected properly and Every card quality is maintained and real time images of card condition provided to the Customer .",
    image: "/images/packing-1.jpeg",
  },
  {
    step: "02",
    title: "Foam wrapping",
    description:
      "Each car is individually wrapped in protective Bubble Wrap so nothing shifts or scratches in transit.",
    image: "/images/packing-2.jpeg",
  },
  {
    step: "03",
    title: "Secure boxing",
    description:
      "Wrapped models go into a snug, double-walled box with corner padding to absorb any impact.",
    image: "/images/packing-3.jpeg",
  },
  {
    step: "04",
    title: "Sealed & dispatched",
    description:
      "The box is tamper-sealed, labelled fragile, and handed off with tracking so you know exactly where it is.",
    image: "/images/packing-4.jpeg",
  },
];

// Reveals an element once it scrolls into view (and stays revealed)
const useInView = (threshold = 0.25) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const PackingRow = ({ step, title, description, image }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`customer-packing-row${inView ? " is-visible" : ""}`}
    >
      <div className="customer-packing-image-wrapper">
        <img src={image} alt={title} className="customer-packing-image" />

        <span className="customer-packing-number" aria-hidden="true">
          {step}
        </span>
      </div>

      <div className="customer-packing-text">
        <span className="customer-packing-tag">Step {step}</span>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  );
};

const CustomerPackingProcess = () => (
  <section className="customer-packing-section">
    <div className="customer-packing-header">
      <span className="customer-packing-eyebrow">
        <i aria-hidden="true" />
        Behind the scenes
      </span>

      <h2>How we pack your order</h2>

      <p>
        From shelf to doorstep, every model is handled with the same care
        you'll give it once it arrives.
      </p>
    </div>

    <div className="customer-packing-list">
      {PACKING_STEPS.map((item) => (
        <PackingRow key={item.step} {...item} />
      ))}
    </div>
  </section>
);

export default CustomerPackingProcess;