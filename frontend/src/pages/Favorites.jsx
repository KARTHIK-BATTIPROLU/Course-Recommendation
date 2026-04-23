import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/users/favorites', config);
        setFavorites(data);
      } catch (err) {
        setError('Failed to fetch favorite courses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          My Saved Courses
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Revisit and access the courses you've marked as favorites.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
           <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Start exploring courses and save them for later.</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;