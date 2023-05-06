const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { sanitizeAuth } = require('../helper/sanitize')

router.post('/login', authController.login);
router.put('/signup', sanitizeAuth, authController.signup)



module.exports = router;