const express = require('express');
const validate = require('../../../utils/validateMiddleware');
const { ClientSignupSchema } = require('../../../utils/validateSchemas');
const { signUp } = require('../../../models/auth');
const router = express.Router();

router.post('/', validate(ClientSignupSchema), signUp);

module.exports = router;
