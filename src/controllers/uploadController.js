const prisma = require('../prismaClient');

// Upload thumbnail for a course
const uploadThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    // check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!course) {
      return res.status(404).json({
        error: 'Course not found',
      });
    }

    // Update the course with the new thumbnail URL
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        thumbnail_url: req.file.path.replace(/\\/g, '/'),
      },
    });

    res.status(200).json({
      message: 'Thumbnail uploaded successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error uploading thumbnail', error);
    res.status(500).json({
      error: 'Failed to upload thumbnail',
    });
  }
};

module.exports = { uploadThumbnail };
