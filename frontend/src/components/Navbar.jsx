import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
               <span className="text-xl font-bold text-indigo-600">SmartCourse</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                 <span className="text-gray-700">Hi, {user.name}</span>
                {user.role === 'admin' ? (
                   <Link to="/admin" className="text-gray-700 hover:text-indigo-600">Admin Dashboard</Link>
                ) : (
                   <Link to="/favorites" className="text-gray-700 hover:text-indigo-600">My Favorites</Link>
                )}
                 <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;