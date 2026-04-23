const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
