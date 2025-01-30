const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const courseValidator = require('../middleware/courseValidator');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const uploadController = require('../controllers/uploadController');

// routes to handle course requests
router.post(
  '/',
  courseValidator,
  authMiddleware,
  courseController.createCourse
);
router.post(
  '/:id/upload-thumbnail',
  upload.single('thumbnail'),
  uploadController.uploadThumbnail
);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
