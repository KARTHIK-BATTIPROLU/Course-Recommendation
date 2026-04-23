const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Flow Test ---');
  try {
    // 1. Register Admin
    console.log('1. Registering Admin...');
    const adminRes = await axios.post(`${API_URL}/users/register`, {
      name: 'Admin User',
      email: `admin_${Date.now()}@test.com`,
      password: 'password123',
      role: 'admin'
    });
    const adminToken = adminRes.data.token;
    console.log('✅ Admin registered properly.');

    // 2. Admin creates a course
    console.log('2. Admin creating course...');
    const courseRes = await axios.post(`${API_URL}/courses`, {
      title: 'Advanced React',
      description: 'Learn React hooks and patterns.',
      category: 'Web Development',
      tags: ['React', 'Frontend']
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const courseId = courseRes.data._id;
    console.log('✅ Course created. ID:', courseId);

    // 3. Admin updates the course
    console.log('3. Admin updating course...');
    await axios.put(`${API_URL}/courses/${courseId}`, {
      title: 'Advanced React Pro'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Course updated.');

    // 4. Register Student
    console.log('4. Registering Student...');
    const studentRes = await axios.post(`${API_URL}/users/register`, {
      name: 'Student User',
      email: `student_${Date.now()}@test.com`,
      password: 'password123',
      role: 'student'
    });
    const studentToken = studentRes.data.token;
    console.log('✅ Student registered properly.');

    // 5. Student gets all courses (and searches)
    console.log('5. Student searching for courses...');
    const searchRes = await axios.get(`${API_URL}/courses?keyword=React`);
    console.log(`✅ Student found ${searchRes.data.length} courses matching "React".`);
    
    // 6. Student adds course to favorites
    console.log('6. Student adding course to favorites...');
    const favRes = await axios.post(`${API_URL}/users/favorites/${courseId}`, {}, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Course favorited:', favRes.data.message);

    // 7. Student gets favorites list
    console.log('7. Student retrieving favorites...');
    const getFavRes = await axios.get(`${API_URL}/users/favorites`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Favorites retrieved. Count: ${getFavRes.data.length}`);

    // 8. Student gets recommendations
    console.log('8. Student getting recommendations...');
    const recRes = await axios.get(`${API_URL}/courses/recommendations`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Recommendations retrieved. Count: ${recRes.data.length}`);

    console.log('🎉 ALL TESTS PASSED!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Request failed with status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

runTests();
