const express = require('express');
const validate = require('../../../utils/validateMiddleware');
const { ClientLoginSchema } = require('../../../utils/validateSchemas');
const { login } = require('../../../models/auth');
const router = express.Router();
router.post('/', validate(ClientLoginSchema), login);

module.exports = router;
