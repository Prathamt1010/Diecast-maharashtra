import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import CustomerNavbar from "../../components/CustomerNavbar/CustomerNavbar";
import { getCategories } from "../../api/categoryApi";

import "./customerCategories.css";

const pad = (number) => String(number).padStart(2, "0");

const CustomerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      const categoryData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <>
      <CustomerNavbar />

      <main className="customer-categories-page">
        <section className="customer-categories-header">
          <span className="customer-categories-eyebrow">
            <i aria-hidden="true" />
            Explore collections
          </span>

          <h1>Shop by category</h1>

          <p>Find your next favourite diecast model.</p>
        </section>

        {loading && (
          <div className="customer-categories-grid" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="customer-category-skeleton" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="customer-categories-message is-error" role="alert">
            <p>{error} Check your connection and try again.</p>
            <button type="button" onClick={loadCategories}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="customer-categories-message">
            <p>No categories available yet. Please check back soon.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <section className="customer-categories-grid">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="customer-category-card"
                style={{ "--i": index }}
              >
                <span className="customer-category-sticker" aria-hidden="true">
                  {pad(index + 1)}
                </span>

                <span className="customer-category-tag">
                  <i aria-hidden="true" />
                  Collection
                </span>

                <h2>{category.name}</h2>

                <p>{category.description || "Explore this collection"}</p>

                <span className="customer-category-footer">
                  <span className="customer-category-view">
                    View details
                  </span>

                  <span className="customer-category-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2.6} />
                  </span>
                </span>
              </Link>
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default CustomerCategories;