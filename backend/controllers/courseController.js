const Course = require('../models/courseModel');

const User = require('../models/userModel');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const courses = await Course.find({ ...keyword }).populate(
      'instructorId',
      'name'
    );

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructorId',
      'name'
    );

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const course = new Course({
      title,
      description,
      category,
      tags: tags || [],
      instructorId: req.user._id,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      // Check if the current user is the course instructor
      if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(401).json({ message: 'Not authorized to update this course' });
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.category = category || course.category;
      course.tags = tags || course.tags;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
       // Check if the current user is the course instructor
       if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this course' });
     }
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommendations
// @route   GET /api/courses/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract categories and tags from favorites
    const favoriteCategories = new Set();
    const favoriteTags = new Set();

    user.favorites.forEach((course) => {
      if (course.category) favoriteCategories.add(course.category);
      if (course.tags) {
        course.tags.forEach((tag) => favoriteTags.add(tag));
      }
    });

    const categoryArray = Array.from(favoriteCategories);
    const tagArray = Array.from(favoriteTags);

    // Rule-based recommendation: Find courses matching categories or tags of favorites
    // Exclude courses that are already in favorites
    let recommendations = [];

    if (categoryArray.length > 0 || tagArray.length > 0) {
      recommendations = await Course.find({
        _id: { $nin: user.favorites.map(f => f._id) },
        $or: [
          { category: { $in: categoryArray } },
          { tags: { $in: tagArray } }
        ]
      })
      .limit(10)
      .populate('instructorId', 'name');
    }

    // If no favorites or not enough recommendations, pad with random/newest courses
    if (recommendations.length < 5) {
       const additionalCourses = await Course.find({
           _id: { $nin: [...user.favorites.map(f => f._id), ...recommendations.map(r => r._id)] }
       })
       .sort({ createdAt: -1 })
       .limit(10 - recommendations.length)
       .populate('instructorId', 'name');
       
       recommendations = [...recommendations, ...additionalCourses];
    }

    res.json(recommendations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getRecommendations
};
