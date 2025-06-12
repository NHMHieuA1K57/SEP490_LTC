const {
  getBookingsService,
  getBookingByIdService,
  confirmBookingService,
  cancelBookingService,
  getBookingHistoryService
} = require('../services/bookingService');

const getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filters = { status, startDate, endDate };
    const response = await getBookingsService(req.user._id, filters);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const response = await getBookingByIdService(req.user._id, req.params.bookingId);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Get booking by ID error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const response = await confirmBookingService(req.user._id, req.params.bookingId);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Confirm booking error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const response = await cancelBookingService(req.user._id, req.params.bookingId, reason);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filters = { startDate, endDate };
    const response = await getBookingHistoryService(req.user._id, filters);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Get booking history error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  getBookingHistory
};