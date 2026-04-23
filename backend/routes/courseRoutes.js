const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getRecommendations,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(protect, admin, createCourse);
router.route('/recommendations').get(protect, getRecommendations);
router
  .route('/:id')
  .get(getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

module.exports = router;
