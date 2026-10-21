import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ImageOff } from "lucide-react";

import "./CustomerProductCard.css";

const CustomerProductCard = ({ product }) => {
  const price = Number(product.price || 0).toLocaleString("en-IN");

  return (
    <div className="customer-product-card">
      <Link
        to={`/shop/products/${product.id}`}
        className="customer-product-image-wrapper"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="customer-product-image"
          />
        ) : (
          <div className="customer-product-no-image">
            <ImageOff size={22} strokeWidth={1.8} />
            <span>No Image</span>
          </div>
        )}

        <span className="customer-product-arrow" aria-hidden="true">
          <ArrowUpRight size={19} strokeWidth={2.4} />
        </span>
      </Link>

      <div className="customer-product-content">
        <span className="customer-product-category">
          <i aria-hidden="true" />
          Diecast Collection
        </span>

        <h3>{product.name}</h3>

        <div className="customer-product-bottom">
          <span className="customer-product-price">₹{price}</span>

          <Link
            to={`/shop/products/${product.id}`}
            className="customer-product-view"
          >
            <span>View Details</span>
            <ArrowUpRight size={14} strokeWidth={2.6} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductCard;