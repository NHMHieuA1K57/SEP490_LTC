const {
  getBookingsService,
  getBookingByIdService,
  confirmBookingService,
  cancelBookingService,
  getBookingHistoryService,
  bookingService,
} = require('../services/bookingService');

const getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filters = { status, startDate, endDate };
    const response = await getBookingsService(req.user._id, filters);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Get bookings error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await getBookingByIdService(req.user._id, bookingId);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Get booking by ID error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await confirmBookingService(req.user._id, bookingId);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Confirm booking error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Lý do hủy là bắt buộc' });
    }
    const response = await cancelBookingService(req.user._id, bookingId, reason);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Cancel booking error: ${error.message}`);
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
    console.error(`Get booking history error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { hotelId, details, paymentMethod } = req.body;
    if (!hotelId || !details) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt phòng' });
    }
    const response = await bookingService.createBookingService(req.user._id, hotelId, details, paymentMethod);
    return res.status(201).json({ success: true, ...response });
  } catch (error) {
    console.error(`Create booking error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const checkoutBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await bookingService.checkoutBookingService(bookingId, req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Checkout booking error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền rút không hợp lệ' });
    }
    const response = await bookingService.requestWithdrawalService(req.user._id, amount);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Request withdrawal error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const confirmWithdrawal = async (req, res) => {
  try {
    const { transactionId, otp } = req.body;
    if (!transactionId || !otp) {
      return res.status(400).json({ success: false, message: 'Thiếu transactionId hoặc OTP' });
    }
    const response = await bookingService.confirmWithdrawalService(req.user._id, transactionId, otp);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Confirm withdrawal error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getWalletDetails = async (req, res) => {
  try {
    const response = await bookingService.getWalletDetailsService(req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Get wallet details error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const handlePaymentFailure = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const response = await bookingService.handlePaymentFailureService(bookingId);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Handle payment failure error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Lý do hoàn tiền là bắt buộc' });
    }
    const response = await bookingService.requestRefundService(bookingId, req.user._id, reason);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`Request refund error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  getBookingHistory,
  createBooking,
  checkoutBooking,
  requestWithdrawal,
  confirmWithdrawal,
  getWalletDetails,
  handlePaymentFailure,
  requestRefund,
};