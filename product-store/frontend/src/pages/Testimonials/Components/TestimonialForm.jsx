
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import {
  createTestimonial,
  updateTestimonial,
} from "../../../api/testimonialApi";

import "./TestimonialForm.css";

const TestimonialForm = ({
  show,
  onClose,
  onSuccess,
  testimonial = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    quote: "",
    avatar: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================================
     Load data for edit
  ================================= */

  useEffect(() => {
    if (mode === "edit" && testimonial) {
      setFormData({
        name: testimonial.name || "",
        location: testimonial.location || "",
        rating: testimonial.rating || 5,
        quote: testimonial.quote || "",
        avatar: testimonial.avatar || "",
        is_active:
          testimonial.is_active !== undefined
            ? testimonial.is_active
            : true,
      });
    } else {
      setFormData({
        name: "",
        location: "",
        rating: 5,
        quote: "",
        avatar: "",
        is_active: true,
      });
    }

    setError("");
  }, [mode, testimonial, show]);

  /* ================================
     Handle input
  ================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ================================
     Submit
  ================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        rating: Number(formData.rating),
        quote: formData.quote.trim(),
        avatar: formData.avatar.trim(),
        is_active: formData.is_active,
      };

      if (!data.name) {
        setError("Customer name is required.");
        setLoading(false);
        return;
      }

      if (!data.quote) {
        setError("Testimonial quote is required.");
        setLoading(false);
        return;
      }

      if (
        data.rating < 1 ||
        data.rating > 5
      ) {
        setError(
          "Rating must be between 1 and 5."
        );
        setLoading(false);
        return;
      }

      /* Edit */
      if (mode === "edit" && testimonial) {
        await updateTestimonial(
          testimonial.id,
          data
        );
      }

      /* Add */
      else {
        await createTestimonial(data);
      }

      if (onSuccess) {
        await onSuccess();
      }

      onClose();

    } catch (error) {
      console.error(
        "Failed to save testimonial:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save testimonial."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        if (!loading) {
          onClose();
        }
      }}
      centered
      className="testimonial-form-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit"
            ? "Edit Testimonial"
            : "Add Testimonial"}
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>

        <Modal.Body>

          {/* Error */}
          {error && (
            <div className="testimonial-form-error">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="testimonial-form-group">

            <label htmlFor="testimonial-name">
              Customer Name
            </label>

            <input
              id="testimonial-name"
              type="text"
              name="name"
              className="testimonial-form-control"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* Location */}
          <div className="testimonial-form-group">

            <label htmlFor="testimonial-location">
              Location
            </label>

            <input
              id="testimonial-location"
              type="text"
              name="location"
              className="testimonial-form-control"
              placeholder="e.g. Pune, Maharashtra"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* Rating */}
          <div className="testimonial-form-group">

            <label htmlFor="testimonial-rating">
              Rating
            </label>

            <select
              id="testimonial-rating"
              name="rating"
              className="testimonial-rating-select"
              value={formData.rating}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>

          </div>

          {/* Quote */}
          <div className="testimonial-form-group">

            <label htmlFor="testimonial-quote">
              Testimonial
            </label>

            <textarea
              id="testimonial-quote"
              name="quote"
              className="testimonial-form-control testimonial-form-textarea"
              placeholder="Enter customer testimonial"
              value={formData.quote}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* Avatar */}
          <div className="testimonial-form-group">

            <label htmlFor="testimonial-avatar">
              Avatar URL
            </label>

            <input
              id="testimonial-avatar"
              type="text"
              name="avatar"
              className="testimonial-form-control"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatar}
              onChange={handleChange}
              disabled={loading}
            />

            <small className="testimonial-form-help">
              Optional. Leave empty to use customer
              initials.
            </small>

          </div>

          {/* Status */}
          <div className="testimonial-status-wrapper">

            <input
              id="testimonial-active"
              type="checkbox"
              name="is_active"
              className="testimonial-status-checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={loading}
            />

            <label
              htmlFor="testimonial-active"
              className="testimonial-status-label"
            >
              Active
            </label>

          </div>

        </Modal.Body>

        <Modal.Footer>

          <button
            type="button"
            className="testimonial-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="testimonial-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Update Testimonial"
              : "Add Testimonial"}
          </button>

        </Modal.Footer>

      </form>
    </Modal>
  );
};

export default TestimonialForm;

