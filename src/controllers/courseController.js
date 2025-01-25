const prisma = require('../prismaClient');
const { validationResult } = require('express-validator');

// Create a new course
const createCourse = async (req, res) => {
  // checking error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    title,
    description,
    price,
    discountPrice,
    averageRating,
    reviewCount,
    language,
    totalDuration,
    thumbnailUrl,
  } = req.body;

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        discount_price: discountPrice,
        average_rating: averageRating,
        review_count: reviewCount,
        language,
        total_duration: totalDuration,
        thumbnail_url: thumbnailUrl,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating new course');
    res.status(500).json({
      error: 'Failed to create new course',
    });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses');
    res.status(500).json({
      error: 'Failed to fetch courses',
    });
  }
};

// Get course by id
const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({
        message: 'Course not found',
      });
    }
  } catch (error) {
    console.error('Error fetching course by ID');
    res.status(500).json({
      error: 'Error fetching course by ID',
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    discountPrice,
    averageRating,
    reviewCount,
    language,
    totalDuration,
    thumbnailUrl,
  } = req.body;

  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price,
        discount_price: discountPrice,
        average_rating: averageRating,
        review_count: reviewCount,
        language,
        total_duration: totalDuration,
        thumbnail_url: thumbnailUrl,
      },
    });
    res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course');
    res.status(500).json({
      error: 'Failed to update course',
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course');
    res.status(500).json({
      error: 'Failed to delete course',
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
