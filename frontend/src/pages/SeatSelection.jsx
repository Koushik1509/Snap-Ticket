import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // We rely strictly on the `bookedSeats` given by the backend
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const { data } = await api.get(`/shows/${showId}`);
        setShow(data);
      } catch (error) {
        toast.error('Failed to load show');
      }
      setLoading(false);
    };
    fetchShow();
  }, [showId]);

  const toggleSeat = (index) => {
    // Check real backend lock state
    if (show.bookedSeats && show.bookedSeats.includes(index)) return; 

    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter(s => s !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  const proceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }
    // Pass precise seat indices
    navigate('/checkout', { state: { show, seatsCount: selectedSeats.length, seatNumbers: selectedSeats } });
  };

  if (loading) return <div className="text-center mt-20 text-3xl font-bold text-gray-400">Loading Seat Map...</div>;
  if (!show) return <div className="text-center mt-20 text-xl text-red-500">Show not found</div>;

  // Let's assume a static capacity of 60 for the UI grid limit unless specified
  const TOTAL_CAPACITY = 60;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-slate-700/50 p-6 flex flex-col md:flex-row justify-between items-center rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white">{show.movieId?.title}</h2>
          <p className="text-gray-400 text-sm mt-1">{show.theaterId?.name} | {new Date(show.showTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-6 bg-slate-800 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center"><div className="w-4 h-4 bg-white rounded-sm mr-2 shadow"></div><span className="text-sm text-gray-300">Available</span></div>
          <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded-sm mr-2 shadow shadow-red-500/50"></div><span className="text-sm text-gray-300">Selected</span></div>
          <div className="flex items-center"><div className="w-4 h-4 bg-slate-700 rounded-sm mr-2 shadow-inner"></div><span className="text-sm text-gray-300">Booked</span></div>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-12">
        <div className="flex flex-col items-center overflow-x-auto pb-8">
          {/* Screen Curve UI */}
          <div className="w-full max-w-3xl mb-16 relative">
             <div className="h-10 border-t-[8px] border-white/20 rounded-[50%] blur-[2px]"></div>
             <div className="absolute top-0 w-full text-center text-gray-500 tracking-[1em] text-xs font-bold pt-2">All Eyes This Way</div>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-10 gap-x-2 sm:gap-x-3 gap-y-6 justify-center mx-auto min-w-[600px]">
            {Array.from({ length: TOTAL_CAPACITY }).map((_, i) => {
              const isBooked = show.bookedSeats && show.bookedSeats.includes(i);
              const isSelected = selectedSeats.includes(i);
              
              let seatClass = 'seat-available';
              if (isBooked) seatClass = 'seat-booked';
              else if (isSelected) seatClass = 'seat-selected';

              return (
                <div 
                  key={i} 
                  className={`seat ${seatClass}`}
                  onClick={() => toggleSeat(i)}
                  title={isBooked ? 'Booked' : `Seat ${i+1}`}
                >
                  {isSelected && <span className="-mt-1 block">{i+1}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-4 left-0 right-0 bg-slate-900/90 backdrop-blur pb-4 pt-4 border-t border-slate-700/50 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] rounded-2xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Selected Seats</p>
            <p className="text-white font-bold text-xl">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-white font-bold text-2xl">₹{selectedSeats.length * 150}</p>
            </div>
            <button onClick={proceedToCheckout} disabled={selectedSeats.length === 0} className={`btn-primary px-10 py-4 text-lg ${selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Pay ₹{selectedSeats.length * 150}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
