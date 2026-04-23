import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await axios.get(`/api/courses/${id}`);
        setCourse(data);

        // Check if it's already a favorite
        if (user) {
           const config = { headers: { Authorization: `Bearer ${user.token}` } };
           const { data: favs } = await axios.get('/api/users/favorites', config);
           const found = favs.find(f => f._id === id);
           setIsFavorite(!!found);
        }
        
      } catch (err) {
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return alert('Please login to save favorites');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/users/favorites/${id}`, {}, config);
      setIsFavorite(!isFavorite);
    } catch (err) {
       console.error(err);
       alert('Failed to update favorites');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading course details...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                {course.category}
              </span>
              
              {user && user.role !== 'admin' && (
                 <button
                   onClick={toggleFavorite}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 transition-all font-semibold shadow-sm
                     ${isFavorite 
                       ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                       : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                     }
                   `}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorite ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                   {isFavorite ? 'Saved to Favorites ❤️' : 'Save Course 🤍'}
                 </button>
              )}
           </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {course.title}
          </h1>
          
          <div className="flex items-center gap-3 text-gray-600">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
               <span className="text-indigo-800 font-bold text-lg">
                 {course.instructorId?.name?.charAt(0).toUpperCase()}
               </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">Instructor: {course.instructorId?.name}</p>
              <p className="text-sm">Added on {new Date(course.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
           <section>
             <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 About this Course
             </h2>
             <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
               {course.description}
             </div>
           </section>

           {course.tags && course.tags.length > 0 && (
             <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Related Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="bg-white border border-gray-200 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
             </section>
           )}
        </div>
        
        <div className="px-8 md:px-12 py-6 bg-gray-50 border-t border-gray-100">
           <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-2 transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to all courses
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;