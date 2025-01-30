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

// Get all courses and query parameters (search, sort, filter, pagination)
const getAllCourses = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10, ...filters } = req.query;
    const where = {};
    const validFields = [
      'id',
      'title',
      'description',
      'price',
      'discount_price',
      'average_rating',
      'review_count',
      'language',
      'total_duration',
      'thumbnail_url',
      'created_at',
      'updated_at',
    ];

    // Filtering
    for (const [key, value] of Object.entries(filters)) {
      if (key.includes('_')) {
        const [field, operator] = key.split('_');
        if (validFields.includes(field)) {
          where[field] = {
            ...where[field],
            [operator]: parseValue(field, value),
          };
        }
      } else if (validFields.includes(key)) {
        where[key] = parseValue(key, value);
      }
    }

    // Searching
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { language: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Sorting
    const orderBy = [];
    if (sort) {
      sort.split(',').forEach(sortParam => {
        const [field, direction] = sortParam.split(':');
        if (validFields.includes(field)) {
          orderBy.push({
            [field]: direction?.toLowerCase() === 'desc' ? 'desc' : 'asc',
          });
        }
      });
    }
    if (orderBy.length === 0) {
      orderBy.push({ created_at: 'asc' });
    }

    // Pagination
    const skip = (page - 1) * limit;
    const courses = await prisma.course.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit, 10),
    });
    const totalCourses = await prisma.course.count({ where });
    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page, 10),
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses', error);
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

// Helper function to parse values based on field type
function parseValue(field, value) {
  const numericFields = {
    id: 'int',
    price: 'float',
    discount_price: 'float',
    average_rating: 'float',
    review_count: 'int',
    total_duration: 'int',
  };

  const dateFields = ['created_at', 'updated_at'];

  if (numericFields[field]) {
    return numericFields[field] === 'int'
      ? parseInt(value, 10)
      : parseFloat(value);
  }
  if (dateFields.includes(field)) {
    return new Date(value);
  }
  return value;
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
