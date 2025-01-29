const express = require('express');
const authenticate = require('../../../utils/checkAuth');
const { logOutUser } = require('../../../models/auth');
const router = express.Router();

router.post('/', authenticate, logOutUser);

module.exports = router;
