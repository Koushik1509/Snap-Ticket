const mongoose = require('mongoose');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
require('dotenv').config();

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const shows = await Show.find({});
  if (shows.length > 0) {
    const show = shows[0];
    const bookings = await Booking.find({ showId: show._id });
    console.log(`Show ID: ${show._id}, Available: ${show.availableSeats}`);
    console.log(`Bookings:`, bookings);
    
    // Simulate what the controller does:
    const showData = show.toObject();
    const confirmedBookings = await Booking.find({ showId: show._id, paymentStatus: 'Confirmed' });
    let bookedSeats = [];
    confirmedBookings.forEach(b => {
      if(b.seatNumbers) {
        bookedSeats.push(...b.seatNumbers);
      }
    });
    showData.bookedSeats = bookedSeats;
    console.log('Processed bookedSeats array for UI:', showData.bookedSeats);
  }
  process.exit();
}
test();
