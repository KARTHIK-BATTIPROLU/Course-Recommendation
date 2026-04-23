const User = require('../models/userModel.js');
const generateToken = require('../utils/generateToken.js');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student', // default to student if not provided
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle favorite course
// @route   POST /api/users/favorites/:id
// @access  Private
const toggleFavoriteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = await User.findById(req.user._id);

    if (user) {
      const isFavorited = user.favorites.includes(courseId);

      if (isFavorited) {
        // Remove from favorites
        user.favorites = user.favorites.filter(
          (id) => id.toString() !== courseId
        );
      } else {
        // Add to favorites
        user.favorites.push(courseId);
      }

      await user.save();
      res.json({ message: isFavorited ? 'Removed from favorites' : 'Added to favorites', favorites: user.favorites });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get favorite courses
// @route   GET /api/users/favorites
// @access  Private
const getFavoriteCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  toggleFavoriteCourse,
  getFavoriteCourses
};
