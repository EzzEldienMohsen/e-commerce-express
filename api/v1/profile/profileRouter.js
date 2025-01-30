const express = require('express');
const authenticate = require('../../../utils/checkAuth');
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../../../models/profile');
const validate = require('../../../utils/validateMiddleware');
const { ClientUserSchema } = require('../../../utils/validateSchemas');
const router = express.Router();

router.get('/', authenticate, getProfile);
router.patch('/', validate(ClientUserSchema), authenticate, updateProfile);
router.delete('/', authenticate, deleteProfile);

module.exports = router;
