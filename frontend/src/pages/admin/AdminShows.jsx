import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({ movieId: '', theaterId: '', showDate: '', showTime: '', availableSeats: 60 });

  const fetchData = async () => {
    try {
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies'),
        api.get('/theaters')
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch (e) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const combinedDateTime = new Date(`${formData.showDate}T${formData.showTime}`).toISOString();
      const submissionData = {
        movieId: formData.movieId,
        theaterId: formData.theaterId,
        showTime: combinedDateTime,
        availableSeats: formData.availableSeats
      };
      await api.post('/shows', submissionData);
      toast.success('Show scheduled successfully');
      fetchData();
      // Reset the form
      setFormData({ movieId: '', theaterId: '', showDate: '', showTime: '', availableSeats: 60 });
    } catch (e) {
      toast.error('Failed to schedule show');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/shows/${id}`);
      toast.success('Show canceled');
      fetchData();
    } catch (e) {
      toast.error('Failed to cancel show');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white border-b border-slate-700 pb-4">Manage Shows</h2>
      
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-4 text-red-500">Schedule a Show</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="input-field" required value={formData.movieId} onChange={e => setFormData({...formData, movieId: e.target.value})}>
            <option value="">Select Movie</option>
            {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
          </select>
          <select className="input-field" required value={formData.theaterId} onChange={e => setFormData({...formData, theaterId: e.target.value})}>
            <option value="">Select Theater</option>
            {theaters.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <div className="flex gap-4">
            <input type="date" className="input-field w-1/2" required value={formData.showDate} onChange={e => setFormData({...formData, showDate: e.target.value})} title="Select Date" />
            <select className="input-field w-1/2" required value={formData.showTime} onChange={e => setFormData({...formData, showTime: e.target.value})} title="Select Time">
              <option value="">Select Time</option>
              <option value="10:00">10:00 AM (Morning)</option>
              <option value="13:30">01:30 PM (Matinee)</option>
              <option value="16:00">04:00 PM (Evening)</option>
              <option value="19:30">07:30 PM (Night)</option>
              <option value="22:30">10:30 PM (Late Night)</option>
            </select>
          </div>
          <input type="number" className="input-field" placeholder="Total Seats" required value={formData.availableSeats} onChange={e => setFormData({...formData, availableSeats: e.target.value})} />
          <button type="submit" className="btn-primary md:col-span-2">Schedule Show</button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-slate-900 border-b border-slate-700 text-gray-400">
            <tr>
              <th className="p-4">Movie</th>
              <th className="p-4">Theater</th>
              <th className="p-4">Timing</th>
              <th className="p-4">Seats Left</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="p-4 font-bold text-white">{show.movieId?.title}</td>
                <td className="p-4">{show.theaterId?.name}</td>
                <td className="p-4">{new Date(show.showTime).toLocaleString()}</td>
                <td className="p-4">{show.availableSeats}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(show._id)} className="text-red-500 hover:text-red-400 font-bold px-3 py-1 bg-red-500/10 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShows;
