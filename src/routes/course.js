const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const courseValidator = require('../middleware/courseValidator');
const updateValidator = require('../middleware/updateValidator');
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
// router to upload thumbnail for a course
router.post(
  '/:id/upload',
  upload.single('thumbnail'),
  uploadController.uploadThumbnail
);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.patch(
  '/:id',
  updateValidator,
  authMiddleware,
  courseController.updateCourse
);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
