const { body } = require('express-validator');

const courseValidator = [
  // Title
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),

  // Description
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),

  // Price
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  // Discount Price (optional)
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),

  // Average Rating (optional)
  body('averageRating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),

  // Review Count (optional)
  body('reviewCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Review count must be a non-negative integer'),

  // Language
  body('language')
    .notEmpty()
    .withMessage('Language is required')
    .bail()
    .isString()
    .withMessage('Language must be a string'),

  // Total Duration
  body('totalDuration')
    .notEmpty()
    .withMessage('Total duration is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Total duration must be a positive integer'),

  // Thumbnail URL (optional)
  body('thumbnailUrl')
    .optional()
    .isURL()
    .withMessage('Thumbnail URL must be a valid URL'),
];

module.exports = courseValidator;
