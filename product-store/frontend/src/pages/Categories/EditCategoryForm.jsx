import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { updateCategory } from "../../api/categoryApi";

const EditCategoryForm = ({
  show,
  category,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setStatus(
        category.status !== undefined
          ? category.status
          : true
      );
    }
  }, [category]);

  if (!show || !category) {
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

      await updateCategory(category.id, {
        name: name.trim(),
        description: description.trim(),
        status,
      });

      onSuccess();
      onClose();

    } catch (error) {
      console.error("Error updating category:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update category"
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
            <h2>Edit Category</h2>

            <p>
              Update category information
            </p>
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

          {/* Category Name */}

          <div className="category-form-group">

            <label>Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* Description */}

          <div className="category-form-group">

            <label>Description</label>

            <textarea
              rows="4"
              placeholder="Enter category description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>


          {/* Status */}

          <div className="category-form-group">

            <label>Status</label>

            <select
              value={status ? "true" : "false"}
              onChange={(e) =>
                setStatus(e.target.value === "true")
              }
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
            <div className="category-form-error">
              {error}
            </div>
          )}


          {/* Actions */}

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
              {loading
                ? "Updating..."
                : "Update Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditCategoryForm;