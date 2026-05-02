import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaUserCircle, FaEnvelope, FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
      setLoading(false);
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="glass-panel p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500 shadow-xl bg-slate-800 flex items-center justify-center">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff&size=128`} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold text-white">{user?.name}</h1>
          <p className="text-lg text-gray-400 flex items-center justify-center md:justify-start">
            <FaEnvelope className="mr-2" /> {user?.email}
          </p>
          <span className="inline-block bg-slate-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-gray-300 mt-2">
            {user?.role} Member
          </span>
        </div>
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="text-3xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6 flex items-center">
          <FaTicketAlt className="mr-3" /> My Bookings
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-slate-800 rounded-xl"></div>
            <div className="h-32 bg-slate-800 rounded-xl"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{booking.showId?.movieId?.title || 'Unknown Movie'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    booking.paymentStatus === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="space-y-3 text-gray-300 flex-grow">
                  <p className="flex items-center"><FaMapMarkerAlt className="mr-3 text-red-400 w-5" /> {booking.showId?.theaterId?.name || 'Unknown Theater'}</p>
                  <p className="flex items-center"><FaCalendarAlt className="mr-3 text-red-400 w-5" /> {new Date(booking.showId?.showTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="flex items-center"><FaClock className="mr-3 text-red-400 w-5" /> {new Date(booking.showId?.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  
                  <div className="pt-4 mt-2 border-t border-slate-700 flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-500 block">Seats</span>
                      <span className="font-bold text-white text-lg">{booking.seatNumbers.join(', ')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 block">Total Paid</span>
                      <span className="font-bold text-green-400 text-xl">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-16 bg-slate-800 rounded-2xl border border-slate-700">
             <FaTicketAlt className="text-6xl text-slate-600 mx-auto mb-4" />
             <h3 className="text-2xl text-white font-bold mb-2">No bookings yet</h3>
             <p className="text-gray-400 max-w-md mx-auto">Looks like you haven't booked any movies. Check out the latest releases and secure your seats now.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
