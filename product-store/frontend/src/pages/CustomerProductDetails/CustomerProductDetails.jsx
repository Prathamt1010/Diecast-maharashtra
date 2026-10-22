import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, ImageOff } from "lucide-react";

import CustomerNavbar from "../../components/CustomerNavbar/CustomerNavbar";
import { getProducts } from "../../api/productApi";

import "./CustomerProductDetails.css";

const CustomerProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      const products = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.products)
        ? response.products
        : [];

      const selectedProduct = products.find(
        (item) => String(item.id) === String(id)
      );

      if (!selectedProduct) {
        setError("Product not found.");
        setProduct(null);
        return;
      }

      setProduct(selectedProduct);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Unable to load product.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleWhatsApp = () => {
    if (!product) return;

    const phoneNumber = "7709874969"; // Replace with your WhatsApp number

    const message = `Hello, I am interested in buying ${product.name}. Price: ₹${product.price}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <>
        <CustomerNavbar />

        <main className="customer-product-details">
          <div className="back-to-shop is-skeleton" aria-hidden="true" />

          <section className="product-details-container">
            <div className="product-details-image-wrapper is-skeleton" />

            <div className="product-details-content">
              <div className="product-details-skeleton-line short" />
              <div className="product-details-skeleton-line tall" />
              <div className="product-details-skeleton-line medium" />
              <div className="product-details-skeleton-line long" />
              <div className="product-details-skeleton-line long" />
            </div>
          </section>
        </main>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <CustomerNavbar />

        <main className="customer-product-details">
          <Link to="/shop" className="back-to-shop">
            <ArrowLeft size={18} strokeWidth={2.4} />
            <span>Back to Shop</span>
          </Link>

          <div className="product-details-message" role="alert">
            <h2>{error || "Product not found."}</h2>
            <p>It may have been removed, or the link could be incorrect.</p>

            <div className="product-details-message-actions">
              <button type="button" onClick={fetchProduct}>
                Try again
              </button>

              <Link to="/shop">Browse all products</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />

      <main className="customer-product-details">
        <Link to="/shop" className="back-to-shop">
          <ArrowLeft size={18} strokeWidth={2.4} />
          <span>Back to Shop</span>
        </Link>

        <section className="product-details-container">
          <div className="product-details-image-wrapper">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
            ) : (
              <div className="product-details-no-image">
                <ImageOff size={28} strokeWidth={1.8} />
                <span>No Image Available</span>
              </div>
            )}
          </div>

          <div className="product-details-content">
            <span className="product-details-label">
              <i aria-hidden="true" />
              Diecast Collection
            </span>

            <h1>{product.name}</h1>

            <span className="product-details-price">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </span>

            <p className="product-details-description">
              {product.description || "Premium diecast car model."}
            </p>

            <button
              type="button"
              className="whatsapp-button"
              onClick={handleWhatsApp}
            >
              <span>
                <MessageCircle size={20} strokeWidth={2.2} />
                Buy on WhatsApp
              </span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default CustomerProductDetails;