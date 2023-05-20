const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authProtect = require('../middleware/is-auth')
const { sanitizeAuth, sanitizeStatus } = require('../helper/sanitize')


router.post('/login', authController.login);
router.put('/signup', sanitizeAuth, authController.signup);
router.get('/status', authProtect, authController.getUserStatus)
router.patch('/status', authProtect, sanitizeStatus, authController.updateUserStatus)



module.exports = router;