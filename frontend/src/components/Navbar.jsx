import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaFilm } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user?.role === 'admin' ? "/admin/dashboard" : "/"} className="flex items-center space-x-2 text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
          <FaFilm />
          <span>StreamLine Cinemas</span>
        </Link>
        <div className="flex items-center space-x-6">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors">Admin Dashboard</Link>
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Book Movies</Link>
            </>
          ) : (
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          )}
          {user ? (
            <>
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-red-500 bg-slate-900 flex items-center justify-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium pr-2">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-red-600/20">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
