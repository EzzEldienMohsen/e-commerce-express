const pool = require('../db');

const getAllProducts = async (req, res) => {
  const { limit = 8, offset = 0, category, latest = false } = req.query;

  try {
    let query = `SELECT * FROM products`;
    const params = [];

    // Add conditions for category
    if (category) {
      query += ` WHERE cat = $${params.length + 1}`;
      params.push(category);
    }

    // Add conditions for ordering (latest)
    if (latest === 'true') {
      query += ` ORDER BY id DESC LIMIT 4`;
    } else {
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(Number(limit), Number(offset));
    }

    const productsResult = await pool.query(query, params);
    const products = productsResult.rows;

    // If paginated, calculate total count, total pages, and current page
    if (latest !== 'true') {
      const countQuery = `SELECT COUNT(*) AS count FROM products ${
        category ? `WHERE cat = $1` : ''
      }`;
      const countParams = category ? [category] : [];
      const totalCountResult = await pool.query(countQuery, countParams);
      const totalCount = parseInt(totalCountResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = Math.floor(offset / limit) + 1;

      return res.json({
        products,
        success: true,
        totalPages,
        currentPage,
      });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch products.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [
      Number(id),
    ]);
    const product = result.rows[0];

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch product.' });
  }
};

module.exports = { getAllProducts, getProductById };
