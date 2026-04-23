const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/courseModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const populateCourses = async () => {
  try {
    // 1. Create a dummy admin user first to be the instructor
    let admin = await User.findOne({ email: 'superadmin_seeder@test.com' });
    if (!admin) {
        admin = await User.create({
            name: 'Super Admin Instructor',
            email: 'superadmin_seeder@test.com',
            password: 'password123', // In real world this should be hashed, but for seeding bypass it or use bcrypt
            role: 'admin'
        });
    }

    const adminId = admin._id;

    // Remove existing courses if needed
    await Course.deleteMany();

    const sampleCourses = [];

    // Category 1: Web Development
    for (let i = 1; i <= 5; i++) {
        sampleCourses.push({
            title: `Web Development Masterclass ${i}`,
            description: `Learn everything about modern web development in this comprehensive course ${i}. Covers HTML, CSS, JS, and React.`,
            category: 'Web Development',
            tags: ['React', 'JavaScript', 'HTML/CSS', 'Frontend'],
            instructorId: adminId
        });
    }

    // Category 2: AI / ML
    for (let i = 1; i <= 5; i++) {
        sampleCourses.push({
            title: `Artificial Intelligence Fundamentals ${i}`,
            description: `Dive deep into Neural Networks, Deep Learning, and AI algorithms in part ${i} of this series.`,
            category: 'AI / ML',
            tags: ['Python', 'TensorFlow', 'Machine Learning', 'AI'],
            instructorId: adminId
        });
    }

    // Category 3: Data Science
    for (let i = 1; i <= 5; i++) {
        sampleCourses.push({
            title: `Data Science Bootcamp ${i}`,
            description: `Analyze data like a pro. In module ${i}, we cover Pandas, Numpy, and data visualization techniques.`,
            category: 'Data Science',
            tags: ['Python', 'Pandas', 'Data Analysis', 'Big Data'],
            instructorId: adminId
        });
    }

    // Category 4: Cybersecurity
    for (let i = 1; i <= 5; i++) {
        sampleCourses.push({
            title: `Essential Cybersecurity ${i}`,
            description: `Protect systems from attacks. Part ${i} covers ethical hacking, network security, and cryptography.`,
            category: 'Cybersecurity',
            tags: ['Security', 'Ethical Hacking', 'Networking', 'InfoSec'],
            instructorId: adminId
        });
    }

    // Category 5: Mobile Development
    for (let i = 1; i <= 5; i++) {
        sampleCourses.push({
            title: `iOS and Android App Dev ${i}`,
            description: `Build cross-platform mobile apps. Course ${i} focuses on React Native and Flutter frameworks.`,
            category: 'Mobile Development',
            tags: ['React Native', 'Flutter', 'iOS', 'Android'],
            instructorId: adminId
        });
    }

    await Course.insertMany(sampleCourses);

    console.log(`Successfully inserted ${sampleCourses.length} courses into the database!`);
    process.exit();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

populateCourses();