import React, { useEffect, useState } from "react";
import { Plus, Search, Tags , Pencil, Trash2} from "lucide-react";
import {
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";
import CategoryForm from "./CategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";
import "./categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const [showForm, setShowForm] = useState(false);

const [editingCategory, setEditingCategory] = useState(null);
const [deleteId, setDeleteId] = useState(null);

const [showEditForm, setShowEditForm] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

const handleEdit = (category) => {
  setEditingCategory(category);
  setShowForm(true);
};

const handleDelete = async () => {
  if (!selectedCategory) return;

  try {
    setDeleting(true);
    setError("");

    await deleteCategory(selectedCategory.id);

    setShowDeleteModal(false);
    setSelectedCategory(null);

    await fetchCategories();
  } catch (error) {
    console.error("Failed to delete category:", error);

    setError(
      error.response?.data?.message ||
        "Failed to delete category"
    );
  } finally {
    setDeleting(false);
  }
};


  return (
    <div className="categories-page">

      {/* Header */}

      <div className="categories-top">

        <div>
          <h1>Categories</h1>

          <p>
            Manage categories for your diecast products
          </p>
        </div>

       <button
  className="add-category-btn"
  onClick={() => setShowForm(true)}
>
  <Plus size={18} />
  +Add Category
</button>

      </div>


      {/* Search */}

      <div className="categories-toolbar">

        <div className="category-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>


      {/* Loading */}

      {loading && (
        <div className="categories-message">
          Loading categories...
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="categories-error">
          {error}
        </div>
      )}


      {/* Empty */}

      {!loading &&
        !error &&
        filteredCategories.length === 0 && (
          <div className="categories-empty">

            <Tags size={40} />

            <h3>No categories found</h3>

            <p>
              Create a category to organize your products.
            </p>

          </div>
        )}


      {/* Category Cards */}

      {!loading &&
        !error &&
        filteredCategories.length > 0 && (

          <div className="categories-grid">

            {filteredCategories.map((category) => (

              <div
  className="category-card"
  key={category.id}
>
  <div className="category-icon">
    <Tags size={22} />
  </div>

  <div className="category-info">
    <h3>{category.name}</h3>

    <p>
      {category.description || "No description"}
    </p>
  </div>

  {/* <span
    className={
      category.is_active
        ? "category-status active"
        : "category-status inactive"
    }
  >
    {category.is_active ? "Active" : "Inactive"}
  </span> */}

  <div className="category-actions">
    <button
  type="button"
  onClick={() => {
    setSelectedCategory(category);
    setShowEditForm(true);
  }}
  title="Edit"
>
  <Pencil size={16} />
</button>

   <button
  type="button"
  onClick={() => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  }}
  title="Delete"
>
  <Trash2 size={16} />
</button>
  </div>
</div>

            ))}

          </div>

        )}

        <CategoryForm
  show={showForm}
  onClose={() => setShowForm(false)}
  onSuccess={fetchCategories}
/>

<EditCategoryForm
  show={showEditForm}
  category={selectedCategory}
  onClose={() => {
    setShowEditForm(false);
    setSelectedCategory(null);
  }}
  onSuccess={fetchCategories}
/>

<DeleteConfirmModal
  show={showDeleteModal}
  onClose={() => {
    if (!deleting) {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  }}
  onConfirm={handleDelete}
  deleting={deleting}
  title="Delete Category"
  message={
    selectedCategory
      ? `Are you sure you want to delete "${selectedCategory.name}"?`
      : "Are you sure you want to delete this category?"
  }
/>

    </div>

    
    
  );
};

export default Categories;