const express = require('express');
const router = express.Router();
const { getMyBookings, getBookings, createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getBookings);

router.route('/my').get(protect, getMyBookings);

router.route('/:id').put(protect, admin, updateBookingStatus);

module.exports = router;
