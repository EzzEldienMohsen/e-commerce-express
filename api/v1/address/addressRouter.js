const express = require('express');
const authenticate = require('../../../utils/checkAuth');
const {
  getAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require('../../../models/addresses');
const validate = require('../../../utils/validateMiddleware');
const { ClientAddressSchema } = require('../../../utils/validateSchemas');
const router = express.Router();

// addresses
router.get('/', authenticate, getAddresses);
router.post('/', validate(ClientAddressSchema), authenticate, createAddress);
// single address
router.get('/:id', authenticate, getAddressById);
router.patch(
  '/:id',
  validate(ClientAddressSchema),
  authenticate,
  updateAddress
);
router.delete('/:id', authenticate, deleteAddress);

module.exports = router;
