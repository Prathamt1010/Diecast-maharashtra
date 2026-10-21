const express = require("express");

const router = express.Router();

const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// GET ALL TESTIMONIALS
// Public
// ===============================
router.get("/", getTestimonials);

// ===============================
// CREATE TESTIMONIAL
// Admin only
// ===============================
router.post(
  "/",
  authMiddleware,
  createTestimonial
);

// ===============================
// UPDATE TESTIMONIAL
// Admin only
// ===============================
router.put(
  "/:id",
  authMiddleware,
  updateTestimonial
);

// ===============================
// DELETE TESTIMONIAL
// Admin only
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  deleteTestimonial
);

module.exports = router;