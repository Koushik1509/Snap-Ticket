import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUsers, FaFilm, FaStore, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import AdminMovies from './AdminMovies';
import AdminTheaters from './AdminTheaters';
import AdminShows from './AdminShows';
import AdminBookings from './AdminBookings';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse text-xl text-gray-400">Loading Dashboard...</div>;
  if (!stats) return <div className="text-xl text-red-400">Failed to load statistics.</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-4 flex items-center">
        <FaChartLine className="mr-3 text-red-500" /> Platform Overview
      </h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <FaMoneyBillWave className="absolute -bottom-4 -right-4 text-green-500/10 text-9xl" />
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Total Revenue</h3>
          <p className="text-4xl font-extrabold text-green-400">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <FaUsers className="absolute -bottom-4 -right-4 text-blue-500/10 text-9xl" />
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-white">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <FaFilm className="absolute -bottom-4 -right-4 text-red-500/10 text-9xl" />
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Movies Listing</h3>
          <p className="text-4xl font-extrabold text-white">{stats.totalMovies}</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <FaStore className="absolute -bottom-4 -right-4 text-purple-500/10 text-9xl" />
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">Partner Theaters</h3>
          <p className="text-4xl font-extrabold text-white">{stats.totalTheaters}</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <div className="glass-panel p-6 sticky top-24">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Admin Portal</h2>
          <nav className="flex flex-col space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`p-3 text-left rounded-lg font-bold transition-all ${activeTab === 'overview' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>Overview</button>
            <button onClick={() => setActiveTab('movies')} className={`p-3 text-left rounded-lg font-bold transition-all ${activeTab === 'movies' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>Movies</button>
            <button onClick={() => setActiveTab('theaters')} className={`p-3 text-left rounded-lg font-bold transition-all ${activeTab === 'theaters' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>Theaters</button>
            <button onClick={() => setActiveTab('shows')} className={`p-3 text-left rounded-lg font-bold transition-all ${activeTab === 'shows' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>Shows</button>
            <button onClick={() => setActiveTab('bookings')} className={`p-3 text-left rounded-lg font-bold transition-all ${activeTab === 'bookings' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>Bookings</button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4">
        <div className="glass-panel p-8">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'movies' && <AdminMovies />}
          {activeTab === 'theaters' && <AdminTheaters />}
          {activeTab === 'shows' && <AdminShows />}
          {activeTab === 'bookings' && <AdminBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
