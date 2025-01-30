const express = require('express');
const authenticate = require('../../../utils/checkAuth');
const {
  getAllCartItems,
  addToCart,
  ClearCart,
  updateCartItem,
  removeCartItem,
} = require('../../../models/cart');
const router = express.Router();

router.get('/', authenticate, getAllCartItems);
router.post('/', authenticate, addToCart);
router.delete('/', authenticate, ClearCart);
router.patch('/:id', authenticate, updateCartItem);
router.delete('/:id', authenticate, removeCartItem);

module.exports = router;
