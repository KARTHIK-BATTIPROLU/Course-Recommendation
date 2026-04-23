import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useAuth();
  
  const categories = ['All', 'Web Development', 'AI / ML', 'Data Science', 'Cybersecurity', 'Mobile Development'];

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses');
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (user) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/courses/recommendations', config);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchRecommendations();
  }, [user]);

  // Filtering Logic
  useEffect(() => {
    let result = courses;

    if (activeCategory !== 'All') {
      result = result.filter(course => course.category === activeCategory);
    }

    if (keyword) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(keyword.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

    setFilteredCourses(result);
  }, [keyword, activeCategory, courses]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Discover Your Next Great Course
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Explore a wide range of academic courses, get personalized recommendations, and jumpstart your career today.
        </p>
      </div>

       {/* Recommendations Section (Only for logged-in users) */}
       {user && recommendations.length > 0 && (
        <section className="bg-indigo-50 rounded-2xl p-8 shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-indigo-900">Recommended for You 🎯</h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-200 px-3 py-1 rounded-full">Based on your interests</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Discovery Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 gap-4">
          <div className="w-full md:w-1/2 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              type="text"
              placeholder="Search by keyword, tag, or title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div>
           {filteredCourses.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                 <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
               </svg>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No courses matching criteria</h3>
               <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
             </div>
           ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
           )}
        </div>
      </section>

    </div>
  );
};

export default Home;