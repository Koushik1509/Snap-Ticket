import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });

  const fetchTheaters = async () => {
    try {
      const { data } = await api.get('/theaters');
      setTheaters(data);
    } catch (e) {
      toast.error('Failed to load theaters');
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/theaters', formData);
      toast.success('Theater added');
      setFormData({ name: '', location: '' });
      fetchTheaters();
    } catch (e) {
      toast.error('Failed to add theater');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/theaters/${id}`);
      toast.success('Theater deleted');
      fetchTheaters();
    } catch (e) {
      toast.error('Failed to delete theater');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white border-b border-slate-700 pb-4">Manage Theaters</h2>
      
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-4 text-red-500">Add New Theater</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Theater Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="input-field" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <button type="submit" className="btn-primary md:col-span-2">Add Theater</button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-slate-900 border-b border-slate-700 text-gray-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map(theater => (
              <tr key={theater._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="p-4 font-bold text-white">{theater.name}</td>
                <td className="p-4">{theater.location}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(theater._id)} className="text-red-500 hover:text-red-400 font-bold px-3 py-1 bg-red-500/10 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTheaters;
