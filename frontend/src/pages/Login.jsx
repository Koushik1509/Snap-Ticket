import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DynamicMovieBackground from '../components/DynamicMovieBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      toast.success('Logged in successfully!');
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] -mt-8 py-12">
      <DynamicMovieBackground />
      
      {/* Login Form */}
      <div className="glass-panel p-10 w-full max-w-md relative z-10 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl bg-slate-800/80">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to book your next cinematic adventure</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="input-field" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-8">
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-400">
          Don't have an account? <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
