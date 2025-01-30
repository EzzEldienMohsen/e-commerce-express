const pool = require('../db');

const fetchWishlistByClientId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM wishlist WHERE client_id = $1',
    [userId]
  );
  if (result.rows.length === 0) {
    return { success: true, id: null, count: 0 };
  }

  return { success: true, id: result.rows[0].id, count: result.rowCount };
};
module.exports = fetchWishlistByClientId;
