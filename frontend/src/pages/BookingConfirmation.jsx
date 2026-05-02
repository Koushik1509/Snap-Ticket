import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt, FaDownload } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

const BookingConfirmation = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      toast.info('📱 SMS and Email containing your QR Ticket have been sent!', {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        toastId: 'booking-success-toast',
      });
    }
  }, [location]);

  if (!location.state) return <Navigate to="/" />;
  const { booking, show } = location.state;

  const qrData = JSON.stringify({
    id: booking._id,
    movie: show.movieId?.title,
    seats: booking.seatNumbers?.join(',') || booking.seats,
    time: show.showTime
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 pb-20 print-area">
      <div className="glass-panel p-10 text-center relative overflow-hidden bg-slate-900 border-none shadow-none md:border md:shadow-2xl md:bg-slate-800">
        <div className="absolute -top-10 -right-10 text-red-500/5 no-print"><FaTicketAlt size={150} /></div>
        
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 drop-shadow-lg no-print" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-10 text-xl no-print">Your payment of <span className="font-bold text-white">₹{booking.totalAmount}</span> was successful.</p>

        <div className="flex flex-col md:flex-row gap-8 bg-slate-800/80 p-8 rounded-3xl text-left border border-slate-700 max-w-3xl mx-auto shadow-2xl relative z-10 print:bg-white print:text-black print:border-black">
          {/* Details */}
          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-3xl text-red-500 mb-6 border-b border-slate-700 pb-2 flex items-center print:text-red-700 print:border-black">
              <FaTicketAlt className="mr-3"/> E-Ticket
            </h3>
            <div><span className="text-gray-500 text-sm print:text-gray-600">Booking ID</span><p className="text-white font-mono bg-slate-900 rounded p-1 text-sm print:bg-transparent print:text-black">{booking._id}</p></div>
            <div><span className="text-gray-500 text-sm print:text-gray-600">Movie</span><p className="text-white text-2xl font-bold print:text-black">{show.movieId?.title}</p></div>
            <div className="flex justify-between">
              <div><span className="text-gray-500 text-sm print:text-gray-600">Theater</span><p className="text-white text-lg print:text-black">{show.theaterId?.name}</p></div>
              <div className="text-right">
                <span className="text-gray-500 text-sm print:text-gray-600">Seats</span>
                <p className="text-red-400 font-bold text-xl print:text-red-600">{booking.seatNumbers ? booking.seatNumbers.join(', ') : booking.seats}</p>
              </div>
            </div>
            <div><span className="text-gray-500 text-sm print:text-gray-600">Date & Time</span><p className="text-white text-lg print:text-black">{new Date(show.showTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
            <hr className="border-slate-700 print:border-black" />
            <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-xl border border-green-500/20 print:bg-transparent print:border-none">
              <span className="text-green-400 print:text-green-800 font-bold">Total Paid</span>
              <p className="text-green-400 font-bold text-3xl print:text-black">₹{booking.totalAmount}</p>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-700 pt-8 md:pt-0 md:pl-8 print:border-black print:border-l-2">
            <div className="bg-white p-4 rounded-xl shadow-xl flex items-center justify-center border border-gray-200">
              <QRCodeSVG value={qrData} size={150} level={"H"} />
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center font-bold print:text-gray-800">Scan at entrance</p>
            <button onClick={handlePrint} className="no-print mt-6 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg flex items-center transition-transform hover:-translate-y-1">
              <FaDownload className="mr-2"/> Download PDF
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 no-print">
          <Link to="/" className="btn-primary py-4 px-8 text-lg w-full sm:w-auto">Browse Movies</Link>
          <Link to="/admin/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl border border-slate-600 transition-all w-full sm:w-auto">My Bookings</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
