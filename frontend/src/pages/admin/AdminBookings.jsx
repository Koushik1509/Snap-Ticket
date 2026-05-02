import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (e) {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { paymentStatus: status });
      toast.success('Status updated');
      fetchBookings();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white border-b border-slate-700 pb-4">All Bookings</h2>
      
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-900 border-b border-slate-700 text-gray-400">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Movie</th>
                <th className="p-4">Seats</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="p-4">{b.userId?.name}</td>
                  <td className="p-4 font-bold text-white">{b.showId?.movieId?.title || 'Unknown'}</td>
                  <td className="p-4">{b.seats}</td>
                  <td className="p-4">₹{b.totalAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${b.paymentStatus === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {b.paymentStatus !== 'Confirmed' && (
                      <button onClick={() => updateStatus(b._id, 'Confirmed')} className="text-green-500 hover:text-green-400 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">Confirm</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
