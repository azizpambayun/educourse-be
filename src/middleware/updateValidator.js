const { body } = require('express-validator');

const updateValidator = [
  body('title').optional().isString().withMessage('Title must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),

  body('averageRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),

  body('reviewCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Review count must be a non-negative integer'),

  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),

  body('totalDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total duration must be a positive integer'),

  body('thumbnailUrl')
    .optional()
    .isURL()
    .withMessage('Thumbnail URL must be a valid URL'),
];

module.exports = updateValidator;
