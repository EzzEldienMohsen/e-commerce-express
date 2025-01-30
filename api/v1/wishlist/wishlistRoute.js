const express = require('express');
const authenticate = require('../../../utils/checkAuth');
const {
  getWishlist,
  addToWishlist,
  removeItemFromWishlist,
  clearWishlist,
} = require('../../../models/wishlist');
const router = express.Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:id', authenticate, removeItemFromWishlist);
router.delete('/', authenticate, clearWishlist);

module.exports = router;
