import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses');
      // Filter to only show courses created by this admin
      const adminCourses = data.filter(c => c.instructorId && c.instructorId._id === user._id);
      setCourses(adminCourses);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((tag) => tag.trim())
      : [];

    const coursePayload = {
      ...formData,
      tags: tagsArray,
    };

    try {
      if (editingId) {
        await axios.put(`/api/courses/${editingId}`, coursePayload, config);
      } else {
        await axios.post('/api/courses', coursePayload, config);
      }
      
      setFormData({ title: '', description: '', category: '', tags: '' });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      tags: course.tags ? course.tags.join(', ') : '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${id}`, config);
        fetchCourses();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="React, CSS, Frontend"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  {editingId ? 'Update Course' : 'Add Course'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', description: '', category: '', tags: '' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">My Courses</h2>
            {courses.length === 0 ? (
              <p className="text-gray-500">You haven't created any courses yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-medium text-gray-700">Title</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Category</th>
                      <th className="py-3 px-4 font-medium text-gray-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{course.title}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                            {course.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;