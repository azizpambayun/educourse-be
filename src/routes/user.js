const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const userValidator = require('../middleware/userValidator');

router.post('/register', userValidator, userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/verify-email', userController.verifyEmail);

module.exports = router;
