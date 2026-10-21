import React from "react";
import { X, Trash2 } from "lucide-react";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({
  show,
  onClose,
  onConfirm,
  deleting = false,
  title = "Delete Category",
  message = "Are you sure you want to delete this category?",
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">

        {/* Header */}

        <div className="delete-modal-header">
          <div className="delete-modal-icon">
            <Trash2 size={22} />
          </div>

          <button
            type="button"
            className="delete-modal-close"
            onClick={onClose}
            disabled={deleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="delete-modal-content">
          <h2>{title}</h2>

          <p>{message}</p>
        </div>

        {/* Actions */}

        <div className="delete-modal-actions">

          <button
            type="button"
            className="delete-modal-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-modal-confirm"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;