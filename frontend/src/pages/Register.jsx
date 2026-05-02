import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DynamicMovieBackground from '../components/DynamicMovieBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] -mt-8 py-12">
      <DynamicMovieBackground />
      
      {/* Register Form */}
      <div className="glass-panel p-10 w-full max-w-md relative z-10 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl bg-slate-800/80">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Join Us</h2>
          <p className="text-gray-400">Create an account to book your tickets</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              className="input-field" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            Create Account
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-400">
          Already have an account? <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
