const { body } = require('express-validator');

const userValidator = [
  body('fullName').isString().withMessage('Full name must be a string'),
  body('username').isString().withMessage('Username must be a string'),
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

module.exports = userValidator;
