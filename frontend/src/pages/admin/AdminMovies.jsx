import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', duration: '', genre: '', language: '', posterUrl: '' });

  const fetchMovies = async () => {
    try {
      const { data } = await api.get('/movies');
      setMovies(data);
    } catch (e) {
      toast.error('Failed to load movies');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies', formData);
      toast.success('Movie added successfully');
      setFormData({ title: '', description: '', duration: '', genre: '', language: '', posterUrl: '' });
      fetchMovies();
    } catch (e) {
      toast.error('Failed to add movie');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      fetchMovies();
    } catch (e) {
      toast.error('Failed to delete movie');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white border-b border-slate-700 pb-4">Manage Movies</h2>
      
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-4 text-red-500">Add New Movie</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input className="input-field" placeholder="Genre" required value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
          <input className="input-field" placeholder="Language" required value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} />
          <input className="input-field" type="number" placeholder="Duration (mins)" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
          <input className="input-field md:col-span-2" placeholder="Poster URL (e.g., /images/filename.jpg or http...)" required value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} />
          <textarea className="input-field md:col-span-2" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <button type="submit" className="btn-primary md:col-span-2">Add Movie</button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-slate-900 border-b border-slate-700 text-gray-400">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Genre</th>
              <th className="p-4">Language</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="p-4 font-bold text-white">{movie.title}</td>
                <td className="p-4">{movie.genre}</td>
                <td className="p-4">{movie.language}</td>
                <td className="p-4">{movie.duration} min</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(movie._id)} className="text-red-500 hover:text-red-400 font-bold px-3 py-1 bg-red-500/10 rounded">Delete</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No movies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMovies;
