const express = require('express');
const validate = require('../../../utils/validateMiddleware');
const { messageSchema } = require('../../../utils/validateSchemas');
const sendMessage = require('../../../models/contact');
const router = express.Router();
router.post('/', validate(messageSchema), sendMessage);

module.exports = router;
