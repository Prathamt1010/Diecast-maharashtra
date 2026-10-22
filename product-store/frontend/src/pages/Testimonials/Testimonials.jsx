
import React, { useEffect, useState } from "react";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getTestimonials,
  deleteTestimonial,
} from "../../api/testimonialApi";

import TestimonialForm from "./Components/TestimonialForm";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";

import "./Testimonials.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTestimonials();

      console.log(
        "Testimonials:",
        response.data
      );

      setTestimonials(response.data);
    } catch (error) {
      console.error(error);

      setError("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTestimonial(
        selectedTestimonial.id
      );

      setShowDeleteModal(false);
      setSelectedTestimonial(null);

      await fetchTestimonials();
    } catch (error) {
      console.error(
        "Failed to delete testimonial:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete testimonial"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="testimonials-page">

      {/* Header */}
      <div className="testimonials-top">
        <div>
          <h1>Testimonials</h1>

          <p>
            Manage customer testimonials displayed
            on your website
          </p>
        </div>

        <button
          type="button"
          className="add-testimonial-btn"
          onClick={() => {
            setShowEditForm(false);
            setSelectedTestimonial(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="testimonials-toolbar">

        <div className="testimonial-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search testimonials..."
          />
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="testimonials-message">
          Loading testimonials...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="testimonials-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        testimonials.length === 0 && (
          <div className="testimonials-empty">

            <MessageSquareQuote size={40} />

            <h3>No testimonials found</h3>

            <p>
              Start adding customer testimonials
              to your website.
            </p>

          </div>
        )}

      {/* Table */}
      {!loading &&
        !error &&
        testimonials.length > 0 && (
          <div className="testimonials-table-card">

            <div className="testimonials-table-wrapper">

              <table className="testimonials-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Testimonial</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {testimonials.map(
                    (testimonial) => (
                      <tr
                        key={testimonial.id}
                      >

                        {/* Customer */}
                        <td>
                          <div className="testimonial-customer">

                            <div className="testimonial-avatar">

                              {testimonial.avatar ? (
                                <img
                                  src={
                                    testimonial.avatar
                                  }
                                  alt={
                                    testimonial.name
                                  }
                                />
                              ) : (
                                <MessageSquareQuote
                                  size={18}
                                />
                              )}

                            </div>

                            <strong>
                              {testimonial.name}
                            </strong>

                          </div>
                        </td>

                        {/* Location */}
                        <td>
                          {testimonial.location ||
                            "-"}
                        </td>

                        {/* Rating */}
                        <td>
                          <div className="testimonial-rating">

                            {"★".repeat(
                              testimonial.rating
                            )}

                            <span>
                              {"☆".repeat(
                                5 -
                                  testimonial.rating
                              )}
                            </span>

                          </div>
                        </td>

                        {/* Quote */}
                        <td>
                          <div className="testimonial-quote">
                            {testimonial.quote}
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={
                              testimonial.is_active
                                ? "status-badge status-active"
                                : "status-badge status-inactive"
                            }
                          >
                            {testimonial.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Created */}
                        <td>
                          {testimonial.created_at
                            ? new Date(
                                testimonial.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* Actions */}
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

                                setSelectedTestimonial(
                                  testimonial
                                );

                                setShowEditForm(
                                  true
                                );
                              }}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTestimonial(
                                  testimonial
                                );

                                setShowDeleteModal(
                                  true
                                );
                              }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* Add Testimonial */}
      <TestimonialForm
        show={showForm}
        onClose={() =>
          setShowForm(false)
        }
        onSuccess={fetchTestimonials}
      />

      {/* Edit Testimonial */}
      <TestimonialForm
        show={showEditForm}
        testimonial={selectedTestimonial}
        mode="edit"
        onClose={() => {
          setShowEditForm(false);
          setSelectedTestimonial(null);
        }}
        onSuccess={fetchTestimonials}
      />

      {/* Delete */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          if (!deleting) {
            setShowDeleteModal(false);
            setSelectedTestimonial(null);
          }
        }}
        onConfirm={handleDelete}
        deleting={deleting}
        title="Delete Testimonial"
        message={
          selectedTestimonial
            ? `Are you sure you want to delete "${selectedTestimonial.name}"?`
            : "Are you sure you want to delete this testimonial?"
        }
      />

    </div>
  );
};

export default Testimonials;

