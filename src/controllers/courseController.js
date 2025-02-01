const prisma = require('../prismaClient');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Constant
const VALID_FIELDS = [
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
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Helper function to handle errors consistently
const handleError = (res, error, context) => {
  logger.error(`${context}:`, error);
  const status = error.status || 500;
  const message = error.message || 'An unexpected error occurred';
  res.status(status).json({ error: message });
};

const validationPagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || DEFAULT_PAGE, 1);
  const parsedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  return { parsedPage, parsedLimit };
};

// Create a new course
const createCourse = async (req, res) => {
  // checking error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // Map request body to Prisma schema
  try {
    const courseData = mapRequestBodyToPrisma(req.body);
    const course = await prisma.course.create({
      data: courseData,
    });
    res.status(201).json(course);
  } catch (error) {
    handleError(res, error, 'Error creating new course');
  }
};

// Get all courses and query parameters (search, sort, filter, pagination)
const getAllCourses = async (req, res) => {
  try {
    const { search, sort, page, limit, ...filters } = req.query;
    const { parsedPage, parsedLimit } = validationPagination(page, limit);

    const where = buildWhereClause(filters, search);
    const orderBy = buildSortClause(sort);

    const [courses, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
      }),
      prisma.course.count({ where }),
    ]);

    res.status(200).json({
      meta: {
        total: totalCourses,
        page: Math.ceil(totalCourses / parsedLimit),
        page: parsedPage,
        limit: parsedLimit,
      },
      data: courses,
    });
  } catch (error) {
    handleError(res, error, 'Error fetching courses');
  }
};

// Get course by id
const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!course) {
      return res.status(404).json({
        error: 'Course not found',
      });
    }
    res.status(200).json(course);
  } catch (error) {
    handleError(res, error, 'Error fetching course by ID');
  }
};

// Update a course
const updateCourse = async (req, res) => {
  // checking error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const courseData = mapRequestBodyToPrisma(req.body);
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: courseData,
    });
    res.status(200).json(course);
  } catch (error) {
    handleError(res, error, 'Error updating course');
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (error) {
    handleError(res, error, 'Error updating course');
  }
};

// Helper function

// Map request body to Prisma schema
const mapRequestBodyToPrisma = body => ({
  title: body.title,
  description: body.description,
  price: body.price,
  discount_price: body.discountPrice,
  average_rating: body.averageRating,
  review_count: body.reviewCount,
  language: body.language,
  total_duration: body.totalDuration,
  thumbnail_url: body.thumbnailUrl,
});

// Build where clause for filtering
const buildWhereClause = (filters, search) => {
  const where = {};

  // Add filter
  Object.entries(filters).forEach(([key, value]) => {
    if (key.includes('_')) {
      const lastUnderscoreIndex = key.lastIndexOf('_');
      const field = key.slice(0, lastUnderscoreIndex);
      const operator = key.slice(lastUnderscoreIndex + 1);
      if (VALID_FIELDS.includes(field)) {
        where[field] = {
          ...where[field],
          [operator]: parseValue(field, value),
        };
      }
    } else if (VALID_FIELDS.includes(key)) {
      where[key] = parseValue(key, value);
    }
  });

  // Add search
  if (search) {
    const searchTerms = search.split(' ');
    where.OR = searchTerms.map(term => ({
      OR: [{ title: { contains: term } }, { description: { contains: term } }],
    }));
  }
  return where;
};

const buildSortClause = sort => {
  if (!sort) return [{ created_at: 'asc' }];

  return sort.split(',').reduce((acc, sortParam) => {
    const [field, direction] = sortParam.split(':');
    if (VALID_FIELDS.includes(field)) {
      acc.push({
        [field]: direction?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      });
    }
    return acc;
  }, []);
};

const parseValue = (field, value) => {
  const numericFields = {
    id: 'int',
    price: 'float',
    discount_price: 'float',
    average_rating: 'float',
    review_count: 'int',
    total_duration: 'int',
  };

  const dateFields = ['created_at', 'updated_at'];

  try {
    if (numericFields[field]) {
      const parsed =
        numericFields[field] === 'int'
          ? parseInt(value, 10)
          : parseFloat(value);
      if (isNaN(parsed)) throw new Error(`Invalid number value for ${field}`);
      return parsed;
    }

    if (dateFields.includes(field)) {
      const date = new Date(value);
      if (isNaN(date)) throw new Error(`Invalid date value for ${field}`);
      return date;
    }

    return value;
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
