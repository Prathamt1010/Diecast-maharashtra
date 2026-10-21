const pool = require("../db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name,
        description || null,
        status !== undefined ? status : true,
      ]
    );

    res.status(201).json({
      message: "Category created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating category:", error);

    // Duplicate category
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = $1,
           description = $2,
           status = $3
       WHERE id = $4
       RETURNING *`,
      [
        name,
        description || null,
        status !== undefined ? status : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error updating category:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM categories
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error deleting category:", error);

    // Category is being used by a product
    if (error.code === "23503") {
      return res.status(409).json({
        message: "Cannot delete category because it is used by a product",
      });
    }

    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
   createCategory,
    updateCategory,
    deleteCategory,
};

 