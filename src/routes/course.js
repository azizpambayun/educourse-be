const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const courseValidator = require('../middleware/courseValidator');
const authMiddleware = require('../middleware/authMiddleware');

// routes to handle course requests
router.post('/', courseValidator, courseController.createCourse);
router.get('/', authMiddleware, courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
