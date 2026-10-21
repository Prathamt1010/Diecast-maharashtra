import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, X } from "lucide-react";

import CustomerNavbar from "../../components/CustomerNavbar/CustomerNavbar";
import CustomerProductCard from "../../components/CustomerProductCard/CustomerProductCard";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

import "./customerProducts.css";

const SKELETON_COUNT = 8;

const CustomerProducts = () => {
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      const productData = Array.isArray(productsResponse)
        ? productsResponse
        : Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : Array.isArray(productsResponse?.products)
        ? productsResponse.products
        : [];

      const categoryData = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : Array.isArray(categoriesResponse?.data)
        ? categoriesResponse.data
        : [];

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Find selected category
  const selectedCategory = categories.find(
    (category) => String(category.id) === String(categoryId)
  );

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategoryId =
        product.categories_id ?? product.category_id;

      const matchesCategory = categoryId
        ? String(productCategoryId) === String(categoryId)
        : true;

      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, categoryId, searchTerm]);

  return (
    <>
      <CustomerNavbar />

      <main className="customer-products-page">
        <section className="customer-products-header">
          <span className="customer-products-eyebrow">
            <i aria-hidden="true" />
            {selectedCategory ? selectedCategory.name : "Our collection"}
          </span>

          <h1>
            {selectedCategory ? selectedCategory.name : "Explore diecast cars"}
          </h1>

          <p>Discover premium diecast models made for collectors.</p>
        </section>

        {/* Search */}
        <div className="customer-search-wrapper">
          <Search size={18} strokeWidth={2.4} />

          <input
            type="text"
            placeholder="Search diecast cars..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              className="customer-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category navigation */}
        <div className="customer-category-filters">
          <Link to="/shop" className={!categoryId ? "active" : ""}>
            All Products
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={
                String(category.id) === String(categoryId) ? "active" : ""
              }
            >
              {category.name}
            </Link>
          ))}
        </div>

        {loading && (
          <div className="customer-products-grid" aria-hidden="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="customer-product-skeleton" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="customer-products-message is-error" role="alert">
            <h3>Something went wrong</h3>
            <p>{error} Check your connection and try again.</p>

            <button
              type="button"
              className="customer-products-retry"
              onClick={fetchData}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="customer-products-message">
            <h3>No products found</h3>
            <p>Try another category or search term.</p>

            {(categoryId || searchTerm) && (
              <Link to="/shop" className="back-to-all-products">
                <ArrowLeft size={16} />
                <span>View All Products</span>
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <section className="customer-products-grid">
            {filteredProducts.map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default CustomerProducts;