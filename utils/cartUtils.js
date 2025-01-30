const pool = require('../db');

const fetchCartByClientId = async (userId) => {
  const result = await pool.query('SELECT * FROM cart WHERE client_id = $1', [
    userId,
  ]);
  if (result.rows.length === 0) {
    return { success: true, id: null, count: 0 };
  }

  return result.rows[0];
};

const fetchCartItems = async (cartId) => {
  const result = await pool.query(
    'SELECT * FROM cart_products WHERE cart_id = $1',
    [cartId]
  );
  return result.rows;
};
const calculateCartTotals = (cartItems, taxRate) => {
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
  const taxes = subTotal * taxRate;
  const totalPrice = subTotal + taxes;

  return { subTotal, taxes, totalPrice };
};

module.exports = { fetchCartByClientId, fetchCartItems, calculateCartTotals };
