import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaQrcode, FaMobileAlt } from 'react-icons/fa';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  
  if (!location.state) {
    navigate('/');
    return null;
  }

  const { show, seatsCount, seatNumbers } = location.state;
  const TICKET_PRICE = 150; // Mock price changed to INR appropriately
  const totalAmount = seatsCount * TICKET_PRICE;

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter a valid UPI ID before paying.');
      return;
    }
    
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      toast.error('Please fill in all credit card details.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const { data } = await api.post('/bookings', {
          showId: show._id,
          seats: seatsCount,
          seatNumbers: seatNumbers,
          totalAmount,
          paymentStatus: 'Confirmed'
        });
        toast.success('Payment successful!');
        navigate('/booking-confirmation', { state: { booking: data, show } });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Booking failed');
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-white border-b border-white/10 pb-4">Secure Checkout</h2>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-inner">
          <h3 className="text-xl font-bold text-red-500 mb-4">Order Summary</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex justify-between border-b border-slate-700/50 pb-2"><span>Movie</span> <span className="text-white font-medium">{show.movieId?.title}</span></p>
            <p className="flex justify-between border-b border-slate-700/50 pb-2"><span>Theater</span> <span className="text-white font-medium">{show.theaterId?.name}</span></p>
            <p className="flex justify-between border-b border-slate-700/50 pb-2"><span>Showtime</span> <span className="text-white font-medium">{new Date(show.showTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></p>
            <p className="flex justify-between border-b border-slate-700/50 pb-2"><span>Selected Seats</span> <span className="text-white font-medium">{seatNumbers.join(', ')}</span></p>
            <div className="pt-4">
              <p className="flex justify-between text-xl items-center"><span className="text-gray-400">Total Payable</span> <span className="text-green-400 font-extrabold text-3xl">₹{totalAmount}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-slate-700">
            <button 
              className={`flex-1 py-4 font-bold flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-slate-800 text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <FaQrcode className="mr-2" /> UPI / QR Code
            </button>
            <button 
              className={`flex-1 py-4 font-bold flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-slate-800 text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard className="mr-2" /> Credit/Debit Card
            </button>
          </div>

          <div className="p-6 relative">
            {paymentMethod === 'upi' ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-gray-300 font-medium">Scan QR Code with any UPI App</p>
                <div className="mx-auto w-48 h-48 bg-white p-4 rounded-xl flex items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=StreamLine&am=${totalAmount}`} alt="UPI QR" className="w-full h-full" />
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
                  <FaMobileAlt className="mr-2" /> OR use your UPI ID below
                </div>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. user@okhdfc)" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 max-w-xs mx-auto block" 
                />
              </div>
            ) : (
              <div className="space-y-4 py-2 text-left">
                <div className="absolute top-0 right-0 p-4 opacity-5"><FaCreditCard size={120}/></div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Card Number</label>
                  <input 
                    type="text" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    placeholder="XXXX XXXX XXXX XXXX" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500" 
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-400 text-sm mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      placeholder="MM/YY" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-400 text-sm mb-1">CVV</label>
                    <input 
                      type="password" 
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      placeholder="•••" 
                      maxLength="3" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Name on Card</label>
                  <input 
                    type="text" 
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    placeholder="JOHN DOE" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500" 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-800/50">
            <h3 className="font-bold text-sm mb-4 flex items-center text-gray-400"><FaLock className="mr-2 text-green-500" /> Secure 128-bit SSL Encrypted Simulation</h3>
            <button 
              onClick={handlePayment} 
              disabled={loading}
              className={`btn-primary w-full py-4 text-xl flex justify-center items-center font-bold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <span className="animate-pulse flex items-center">Processing Secure Payment <FaLock className="ml-3 animate-spin"/></span> : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
