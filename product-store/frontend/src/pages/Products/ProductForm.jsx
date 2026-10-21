import React, { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { createProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

const ProductForm = ({ show, onClose, onSuccess }) => {
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

  useEffect(() => {
    if (!show) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setError("");

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
  const file = e.target.files?.[0];

  if (!file) return;

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError("Only JPG, PNG or WEBP images are allowed");
    return;
  }

  // Validate file size - 5MB
  if (file.size > 5 * 1024 * 1024) {
    setError("Image size must be less than 5MB");
    return;
  }

  // Store actual file
  setFormData((prev) => ({
    ...prev,
    image: file,
  }));

  // Create preview
  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);

  // Clear previous error
  setError("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

     console.log("IMAGE FILE:", formData.image);


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

     const formDataToSend = new FormData();

formDataToSend.append("name", formData.name.trim());
formDataToSend.append(
  "description",
  formData.description.trim()
);

formDataToSend.append(
  "categories_id",
  formData.categories_id
    ? Number(formData.categories_id)
    : ""
);

formDataToSend.append(
  "price",
  formData.price ? Number(formData.price) : 0
);

formDataToSend.append(
  "status",
  formData.status
);

if (formData.image) {
  formDataToSend.append("image", formData.image);
}

console.log("FormData image:", formData.image);




await createProduct(formDataToSend);

      setFormData({
        name: "",
        description: "",
        categories_id: "",
        price: "",
        status: true,
        image: null,
      });

      setImagePreview(null);

      onSuccess();
      onClose();

    } catch (error) {
      console.error("Error creating product:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setFormData({
      name: "",
      description: "",
      categories_id: "",
      price: "",
      status: true,
      image: null,
    });

    setImagePreview(null);
    setError("");

    onClose();
  };

  if (!show) {
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
              Add Product
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Add a new diecast product
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Product Name */}

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description */}

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Image Upload */}

         {/* Image Upload */}

<div style={{ marginBottom: "16px" }}>

  <label
    style={{
      display: "block",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: "600",
    }}
  >
    Product Image
  </label>

  <label
    htmlFor="product-image"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "150px",
      border: "2px dashed #ddd",
      borderRadius: "10px",
      cursor: "pointer",
      background: "#fafafa",
      overflow: "hidden",
    }}
  >

    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Product preview"
        style={{
          width: "100%",
          height: "180px",
          objectFit: "contain",
        }}
      />
    ) : (
      <>
        <Upload
          size={30}
          style={{
            marginBottom: "8px",
            color: "#f4c400",
          }}
        />

        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Click to upload image
        </span>

        <span
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#777",
          }}
        >
          JPG, PNG or WEBP • Max 5MB
        </span>
      </>
    )}

    <input
      id="product-image"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageChange}
      style={{
        display: "none",
      }}
    />

  </label>

  {imagePreview && (
    <button
      type="button"
      onClick={() => {
        setFormData((prev) => ({
          ...prev,
          image: null,
        }));

        setImagePreview(null);
      }}
      style={{
        marginTop: "8px",
        border: "none",
        background: "transparent",
        color: "#dc3545",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      Remove image
    </button>
  )}

</div>

          {/* Category */}

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Category
            </label>

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
                background: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
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
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Price
            </label>

            <input
              type="number"
              name="price"
              min="0"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Status */}

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Status
            </label>

            <select
              value={formData.status ? "true" : "false"}
              onChange={handleStatusChange}
              style={{
                width: "100%",
                height: "42px",
                padding: "0 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                boxSizing: "border-box",
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
                borderRadius: "8px",
                background: "#fff0f0",
                color: "#dc3545",
                fontSize: "13px",
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
              marginTop: "22px",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                height: "42px",
                padding: "0 18px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: "42px",
                padding: "0 20px",
                border: "none",
                borderRadius: "8px",
                background: "#f4c400",
                color: "#111",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading
                ? "Saving..."
                : "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;