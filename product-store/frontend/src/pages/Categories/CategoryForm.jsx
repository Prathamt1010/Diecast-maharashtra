import React, { useState } from "react";
import { X } from "lucide-react";
import { createCategory } from "../../api/categoryApi";

const CategoryForm = ({ show, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCategory({
        name: name.trim(),
        description: description.trim(),
        is_active: true,
      });

      setName("");
      setDescription("");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-modal-overlay">

      <div className="category-modal">

        <div className="category-modal-header">
          <div>
            <h2>Add Category</h2>
            <p>Create a new product category</p>
          </div>

          <button
            type="button"
            className="category-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="category-form-group">
            <label>Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="category-form-group">
            <label>Description</label>

            <textarea
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          {error && (
            <div className="category-form-error">
              {error}
            </div>
          )}

          <div className="category-form-actions">

            <button
              type="button"
              className="category-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="category-save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CategoryForm;