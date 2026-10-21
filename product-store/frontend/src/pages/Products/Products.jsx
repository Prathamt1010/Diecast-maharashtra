import React, { useEffect, useState } from "react";
import { Package, Plus, Search , Pencil, Trash2} from "lucide-react";
import { getProducts , deleteProduct} from "../../api/productApi";
import ProductForm from "../Products/ProductForm";
import EditProductForm from "../../pages/Products/EditProductForm";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";
import "./products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
  if (!selectedProduct) return;

  try {
    setDeleting(true);
    setError("");

    await deleteProduct(selectedProduct.id);

    setShowDeleteModal(false);
    setSelectedProduct(null);

    await fetchProducts();
  } catch (error) {
    console.error("Failed to delete product:", error);

    setError(
      error.response?.data?.message ||
        "Failed to delete product"
    );
  } finally {
    setDeleting(false);
  }
};

  return (
    <div className="products-page">

      <div className="products-top">
        <div>
          <h1>Products</h1>
          <p>Manage your diecast product collection</p>
        </div>

      <button
  type="button"
  className="add-product-btn"
  onClick={() => {
    setShowEditForm(false);
    setSelectedProduct(null);
    setShowForm(true);
  }}
>
  <Plus size={18} />
  Add Product
</button>
      </div>

      <div className="products-toolbar">
        <div className="product-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
          />
        </div>
      </div>

      {loading && (
        <div className="products-message">
          Loading products...
        </div>
      )}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="products-empty">
          <Package size={40} />

          <h3>No products found</h3>

          <p>
            Start adding products to your collection.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-table-card">

          <div className="products-table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>

                    <td>
                      <div className="product-info">

                        <div className="product-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>

                        <div>
                          <strong>{product.name}</strong>

                          <span>
                            {product.description}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      {product.category ?? "Uncategorized"}
                    </td>

                    <td>
                      ₹{product.price}
                    </td>

                    <td>
                      <span
                        className={
                          product.status
                            ? "status-badge status-active"
                            : "status-badge status-inactive"
                        }
                      >
                        {product.status
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {product.created_at
                        ? new Date(
                            product.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
  <div
    style={{
      display: "flex",
      gap: "8px",
    }}
  >
    <button
  type="button"
  onClick={() => {
    setShowForm(false);
    setSelectedProduct(product);
    setShowEditForm(true);
  }}
  title="Edit"
>
  <Pencil size={16} />
</button>

    <button
      type="button"
      onClick={() => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
      }}
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  </div>
</td>

                    

                  </tr>
                  
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}
      

<ProductForm
  show={showForm}
  onClose={() => setShowForm(false)}
  onSuccess={fetchProducts}
/>

<EditProductForm
  show={showEditForm}
  product={selectedProduct}
  onClose={() => {
    setShowEditForm(false);
    setSelectedProduct(null);
  }}
  onSuccess={fetchProducts}
/>

<DeleteConfirmModal
  show={showDeleteModal}
  onClose={() => {
    if (!deleting) {
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  }}
  onConfirm={handleDelete}
  deleting={deleting}
  title="Delete Product"
  message={
    selectedProduct
      ? `Are you sure you want to delete "${selectedProduct.name}"?`
      : "Are you sure you want to delete this product?"
  }
/>

    </div>
  );
};

export default Products;