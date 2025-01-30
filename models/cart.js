const pool = require('../db');
const {
  fetchCartByClientId,
  fetchCartItems,
  calculateCartTotals,
} = require('../utils/cartUtils');

const getAllCartItems = async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart.id) {
      return res.status(200).json({
        success: true,
        data: [
          {
            items: [],
            totalPrice: 0,
            totalItems: 0,
            taxes: 0,
            cartId: 0,
            subTotal: 0,
          },
        ],
        totalItems: 0,
      });
    }
    const cartItems = await fetchCartItems(cart.id);
    const totalItems = cartItems.length;
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );
    const data = {
      items: cartItems,
      totalPrice,
      totalItems,
      taxes: cart.taxes,
      cartId: cart.id,
      subTotal,
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('error fetching cart', error);
    res.status(500).json({ success: false, message: 'Failed Fetching cart' });
  }
};

const addToCart = async (req, res) => {
  const userId = req.userId;
  const { img, name, type, price, cat, id, amount } = req.body;
  try {
    let cart = await fetchCartByClientId(userId);
    if (!cart.id) {
      const creatingCart = await pool.query(
        'INSERT INTO cart (client_id) VALUES ($1) RETURNING *',
        [userId]
      );
      cart = creatingCart.rows[0];
    }
    await pool.query(
      'INSERT INTO cart_products (img, name, type, price, cat, cart_id, product_id, amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [img, name, type, price, cat, cart.id, id, amount]
    );

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await pool.query(
      'UPDATE cart SET sub_total = $1, total_price = $2 WHERE id = $3',
      [subTotal, totalPrice, cart.id]
    );
    res
      .status(201)
      .json({ success: true, message: 'Added to cart successfully' });
  } catch (error) {
    console.error('error adding to cart', error);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { newAmount } = req.body;
  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart.id) {
      return res
        .status(404)
        .json({ success: false, message: 'cart not found' });
    }
    if (newAmount <= 0) {
      return removeCartItem(req, res);
    }

    await pool.query(
      'UPDATE cart_products SET amount = $1 WHERE id = $2 AND cart_id = $3',
      [newAmount, id, cart.id]
    );

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await pool.query(
      'UPDATE cart SET sub_total = $1, total_price = $2 WHERE id = $3',
      [subTotal, totalPrice, cart.id]
    );
    res
      .status(202)
      .json({ success: true, message: 'item updated successfully' });
  } catch (error) {
    console.error('error updating cart item', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update cart item' });
  }
};

const removeCartItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart.id) {
      return res
        .status(404)
        .json({ success: false, message: 'cart not found' });
    }
    await pool.query(
      'DELETE FROM cart_products WHERE id = $1 AND cart_id = $2',
      [id, cart.id]
    );

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await pool.query(
      'UPDATE cart SET sub_total = $1, total_price = $2 WHERE id = $3',
      [subTotal, totalPrice, cart.id]
    );
    res.status(202).json({ success: true, message: 'item removed from cart' });
  } catch (error) {
    console.error('error removing cart item', error);
    res
      .status(500)
      .json({ success: false, message: 'failed to delete cart item' });
  }
};

const ClearCart = async (req, res) => {
  const userId = req.userId;
  try {
    await pool.query('DELETE FROM cart WHERE client_id = $1 RETURNING *', [
      userId,
    ]);
    res
      .status(202)
      .json({ success: true, message: 'cart cleared successfully' });
  } catch (error) {
    console.error('error clearing cart', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

module.exports = {
  getAllCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  ClearCart,
};
