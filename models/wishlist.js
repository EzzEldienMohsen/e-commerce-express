const pool = require('../db');
const fetchWishlistByClientId = require('../utils/wishlistUtils');
const getWishlist = async (req, res) => {
  const userId = req.userId;
  try {
    const wishlist = await fetchWishlistByClientId(userId);
    if (!wishlist.id) {
      return res.status(200).json({ success: true, data: [], count: 0 });
    }
    const wishlistItems = await pool.query(
      `
    SELECT * FROM wishlist_items WHERE wishlist_id = $1
    `,
      [wishlist.id]
    );
    res.status(200).json({
      success: true,
      data: wishlistItems.rows,
      count: wishlistItems.rowCount,
    });
  } catch (error) {
    console.error('error fetching wishlist', error);
    res.status(500).json({
      success: false,
      data: [],
      message: 'error fetching your wishlist,try again later',
    });
  }
};

const addToWishlist = async (req, res) => {
  const userId = req.userId;
  const { img, name, type, price, cat, id, product_id } = req.body;
  try {
    let wishlist = await fetchWishlistByClientId(userId);
    if (!wishlist.id) {
      const createResult = await pool.query(
        'INSERT INTO wishlist (client_id) VALUES ($1) RETURNING *',
        [userId]
      );
      wishlist = createResult.rows[0];
    }
    const productId = product_id ?? id;
    await pool.query(
      `INSERT INTO wishlist_items (img, name, type, price, cat, wishlist_id, product_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [img, name, type, price, cat, wishlist.id, productId]
    );
    res
      .status(201)
      .json({ success: true, message: 'Item added to wishlist successfully' });
  } catch (error) {
    console.error('error adding to wishlist', error);
    res.status(500).json({
      success: false,
      message: 'failed to add to your wishlist, please try again later',
    });
  }
};

const removeItemFromWishlist = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const wishlist = await fetchWishlistByClientId(userId);
    if (!wishlist.id) {
      return res
        .status(404)
        .json({ success: false, message: 'Could not find wishlist' });
    }
    await pool.query(
      `DELETE FROM wishlist_items WHERE id = $1 AND wishlist_id = $2`,
      [id, wishlist.id]
    );
    res
      .status(202)
      .json({ success: true, message: 'Item removed successfully' });
  } catch (error) {
    console.error('error removing wishlist item', error);
    res.status(500).json({
      success: false,
      message: 'Failed removing the item, try again later',
    });
  }
};

const clearWishlist = async (req, res) => {
  const userId = req.userId;
  try {
    await pool.query(`DELETE FROM wishlist WHERE client_id = $1`, [userId]);
    res
      .status(202)
      .json({ success: true, message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('error clearing wishlist', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed clearing wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
