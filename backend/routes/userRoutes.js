const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  toggleFavoriteCourse,
  getFavoriteCourses,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/favorites').get(protect, getFavoriteCourses);
router.route('/favorites/:id').post(protect, toggleFavoriteCourse);

module.exports = router;
