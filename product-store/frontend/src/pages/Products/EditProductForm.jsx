import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { updateProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

const EditProductForm = ({
  show,
  product,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categories_id: "",
    price: "",
    status: true,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    if (!show) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [show]);

  // Fill existing product data
  useEffect(() => {
    if (!show || !product) return;

    setFormData({
      name: product.name || "",
      description: product.description || "",
      categories_id: product.categories_id
        ? String(product.categories_id)
        : "",
      price: product.price || "",
      status: product.status ?? true,
      image: null,
    });

    // Show existing Cloudinary image
    if (product.image) {
      setImagePreview(product.image);
    } else {
      setImagePreview(null);
    }

    setError("");
  }, [show, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value === "true",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) return;

    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.price) {
      setError("Product price is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = new FormData();

      payload.append(
        "name",
        formData.name.trim()
      );

      payload.append(
        "description",
        formData.description.trim()
      );

      if (formData.categories_id) {
        payload.append(
          "categories_id",
          Number(formData.categories_id)
        );
      }

      payload.append(
        "price",
        Number(formData.price)
      );

      payload.append(
        "status",
        formData.status
      );

      // Only send new image if user selected one
      if (formData.image) {
        payload.append(
          "image",
          formData.image
        );
      }

      await updateProduct(
        product.id,
        payload
      );

      onSuccess();
      onClose();

    } catch (error) {
      console.error(
        "Error updating product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setError("");
    setImagePreview(null);

    onClose();
  };

  if (!show || !product) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
        }}
      >

        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              Edit Product
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Update product details
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            style={{
              border: "none",
              background: "#f3f3f3",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Product Name */}

          <div style={{ marginBottom: "16px" }}>
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Description */}

          <div style={{ marginBottom: "16px" }}>
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Image */}

          <div style={{ marginBottom: "16px" }}>
            <label>Product Image</label>

            <label
              htmlFor="edit-product-image"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
                border: "2px dashed #ddd",
                borderRadius: "10px",
                cursor: "pointer",
                marginTop: "6px",
                overflow: "hidden",
                background: "#fafafa",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div>
                  <Upload size={30} />
                  <p>Click to upload image</p>
                </div>
              )}

              <input
                id="edit-product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* Category */}

          <div style={{ marginBottom: "16px" }}>
            <label>Category</label>

            <select
              name="categories_id"
              value={formData.categories_id}
              onChange={handleChange}
              disabled={loadingCategories}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
              }}
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}

          <div style={{ marginBottom: "16px" }}>
            <label>Price</label>

            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Status */}

          <div style={{ marginBottom: "16px" }}>
            <label>Status</label>

            <select
              value={
                formData.status
                  ? "true"
                  : "false"
              }
              onChange={handleStatusChange}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
              }}
            >
              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>
          </div>

          {/* Error */}

          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                background: "#fff0f0",
                color: "#dc3545",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#f4c400",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              {loading
                ? "Updating..."
                : "Update Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProductForm;