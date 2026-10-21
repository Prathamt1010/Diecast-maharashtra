const pool = require("../db");

// ===============================
// GET ALL ACTIVE TESTIMONIALS
// ===============================
const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        location,
        rating,
        quote,
        avatar,
        is_active,
        created_at
      FROM testimonials
      WHERE is_active = true
      ORDER BY id ASC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching testimonials:", error);

    res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

// ===============================
// CREATE TESTIMONIAL
// ===============================
const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      location,
      rating,
      quote,
      avatar,
      is_active,
    } = req.body;

    // Required fields
    if (!name || !quote || rating === undefined) {
      return res.status(400).json({
        message: "Name, quote and rating are required",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO testimonials
      (
        name,
        location,
        rating,
        quote,
        avatar,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name,
        location || null,
        rating,
        quote,
        avatar || null,
        is_active !== undefined ? is_active : true,
      ]
    );

    res.status(201).json({
      message: "Testimonial created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);

    res.status(500).json({
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE TESTIMONIAL
// ===============================
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      location,
      rating,
      quote,
      avatar,
      is_active,
    } = req.body;

    if (!name || !quote || rating === undefined) {
      return res.status(400).json({
        message: "Name, quote and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check testimonial exists
    const existingTestimonial = await pool.query(
      `SELECT * FROM testimonials WHERE id = $1`,
      [id]
    );

    if (existingTestimonial.rows.length === 0) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    const result = await pool.query(
      `
      UPDATE testimonials
      SET
        name = $1,
        location = $2,
        rating = $3,
        quote = $4,
        avatar = $5,
        is_active = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        location || null,
        rating,
        quote,
        avatar || null,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    res.status(200).json({
      message: "Testimonial updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);

    res.status(500).json({
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

// ===============================
// DELETE TESTIMONIAL
// ===============================
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM testimonials
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      message: "Testimonial deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);

    res.status(500).json({
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};