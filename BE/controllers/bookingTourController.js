const mongoose = require('mongoose');
const bookingTourService = require('../services/bookingTourService');

function toObjectId(id) { try { return new mongoose.Types.ObjectId(id); } catch { return null; } }

exports.bookTour = async (req, res) => {
  try {
    const booking = await bookingTourService.bookTour(req.user, req.body);
    return res.status(201).json({ message: 'Đặt tour thành công', booking });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.refundBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await bookingTourService.refundBooking(bookingId, req.user._id);
    return res.status(200).json({ message: 'Hoàn tiền thành công', transaction: result });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.searchBookings = async (req, res) => {
  try {
    const {
      status, tourId, customerId, paymentStatus, isPrivateBooking,
      page = 1, limit = 20, sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (tourId && toObjectId(tourId)) filter.tourId = tourId;
    if (customerId && toObjectId(customerId)) filter.customerId = customerId;
    if (paymentStatus) filter['payment.status'] = paymentStatus;
    if (typeof isPrivateBooking !== 'undefined') filter.isPrivateBooking = isPrivateBooking === 'true';

    const options = {
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
      sort
    };

    const result = await bookingTourService.searchBookings({ filter, options });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error searching bookings:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const result = await bookingTourService.getMyBookings(req.user._id, {
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
      sort
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
