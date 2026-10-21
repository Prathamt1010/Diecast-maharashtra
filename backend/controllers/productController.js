const pool = require("../db");
const cloudinary = require("../config/cloudinary");

// ===============================
// GET ALL PRODUCTS
// ===============================
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.categories_id,
        c.name AS category,
        p.status,
        p.created_at
      FROM products p
      LEFT JOIN categories c
        ON p.categories_id = c.id
      ORDER BY p.id DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = async (req, res) => {
  
  try {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
    const {
      name,
      description,
      price,
      categories_id,
      status,
    } = req.body;

    
      

    // Required fields
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    // Validate category if provided
    if (
      categories_id !== null &&
      categories_id !== undefined &&
      categories_id !== ""
    ) {
      const categoryResult = await pool.query(
        "SELECT id FROM categories WHERE id = $1",
        [categories_id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(400).json({
          message: "Invalid category_id",
        });

       
      }
    }

    // ===============================
    // CLOUDINARY IMAGE UPLOAD
    // ===============================

    let imageUrl = null;

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "diecast-maharashtra/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(req.file.buffer);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    // ===============================
    // INSERT PRODUCT
    // ===============================

    const result = await pool.query(
      `INSERT INTO products
        (
          name,
          description,
          price,
          image,
          categories_id,
          status
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        description || null,
        price,
        imageUrl,
        categories_id || null,
        status !== undefined ? status : true,
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      categories_id,
      status,
    } = req.body;

    // Required fields
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    // Validate category if provided
    if (
      categories_id !== null &&
      categories_id !== undefined &&
      categories_id !== ""
    ) {
      const categoryResult = await pool.query(
        "SELECT id FROM categories WHERE id = $1",
        [categories_id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(400).json({
          message: "Invalid category_id",
        });
      }
    }

    // Get existing product
    const existingProduct = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let imageUrl = existingProduct.rows[0].image;

    // ===============================
    // UPLOAD NEW IMAGE IF PROVIDED
    // ===============================

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "diecast-maharashtra/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(req.file.buffer);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    // ===============================
    // UPDATE PRODUCT
    // ===============================

    const result = await pool.query(
      `UPDATE products
       SET
         name = $1,
         description = $2,
         price = $3,
         image = $4,
         categories_id = $5,
         status = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        description || null,
        price,
        imageUrl,
        categories_id || null,
        status !== undefined ? status : true,
        id,
      ]
    );

    res.status(200).json({
      message: "Product updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product first
    const productResult = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = productResult.rows[0];

    // Delete product from database
    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // ===============================
    // DELETE IMAGE FROM CLOUDINARY
    // ===============================

    if (product.image) {
      try {
        const imageUrl = product.image;

        // Extract Cloudinary public_id
        const uploadIndex = imageUrl.indexOf("/upload/");

        if (uploadIndex !== -1) {
          let publicId = imageUrl.substring(
            uploadIndex + 8
          );

          // Remove version
          publicId = publicId.replace(
            /^v\d+\//,
            ""
          );

          // Remove extension
          publicId = publicId.replace(
            /\.[^/.]+$/,
            ""
          );

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary image delete failed:",
          cloudinaryError
        );

        // Product is already deleted,
        // so don't fail the API because of image deletion.
      }
    }

    res.status(200).json({
      message: "Product deleted successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT
// ===============================

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};