const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { sanitizeAuth } = require('../helper/sanitize')



router.put('/signup', sanitizeAuth, authController.signup)


module.exports = router;