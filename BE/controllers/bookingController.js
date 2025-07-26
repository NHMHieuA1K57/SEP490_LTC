const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

const getPendingBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, hotelId } = req.query;
    const filters = { hotelId };
    const response = await bookingService.getPendingBookingsService(
      req.user._id,
      filters,
      parseInt(page),
      parseInt(limit)
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng cần xác nhận:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingsByOwnerHotels = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, hotelId, fromDate, toDate } = req.query;
    const filters = { status, hotelId, fromDate, toDate };
    const response = await bookingService.getBookingsByOwnerHotelsService(
      req.user._id,
      filters,
      parseInt(page),
      parseInt(limit)
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const response = await bookingService.getBookingDetailsService(req.params.id, req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đặt phòng:', error.message);
    return res.status(error.message.includes('quyền') ? 403 : 400).json({
      success: false,
      message: error.message
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const response = await bookingService.updateBookingStatusService(req.params.id, req.user._id, status);
    return res.status(200).json({
      message: 'Trạng thái đã được cập nhật',
      booking: response
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đặt phòng:', error.message);
    return res.status(error.message.includes('quyền') ? 403 : 400).json({
      success: false,
      message: error.message
    });
  }
};
const createBooking = async (req, res) => {
  try {
    const userId = req.user._id?.toString?.(); // ✅ FIXED
    console.log('Dữ liệu body nhận được:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Body request không được gửi hoặc rỗng' });
    }

    const bookingData = req.body;
    const result = await bookingService.createBookingService(userId, bookingData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Lỗi trong createBooking:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCustomerBookingsHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('hotelId', 'name address images')
      .select('-__v');

    const simplified = bookings.map(booking => ({
      bookingId: booking._id,
      hotelName: booking.hotelId?.name,
      address: booking.hotelId?.address,
      thumbnail: booking.hotelId?.images?.[0] || null,
      checkInDate: booking.details?.checkInDate,
      checkOutDate: booking.details?.checkOutDate,
      roomType: booking.details?.roomType,
      numberOfPeople: booking.details?.numberOfPeople,
      status: booking.status,
      totalPrice: booking.totalPrice,
      bookingCode: booking.paymentInfo?.bookingCode,
      createdAt: booking.createdAt
    }));

    res.status(200).json({ success: true, data: simplified });
  } catch (error) {
    console.error('Error getCustomerBookingsHistory:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử đặt phòng' });
  }
};


const getCustomerBookingDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: 'ID đặt phòng không hợp lệ' });
    }

    const booking = await Booking.findOne({ _id: bookingId, userId })
      .populate('hotelId', 'name address images')
      .select('-__v');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt phòng' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPendingBookings,
  getBookingsByOwnerHotels,
  getBookingDetails,
  updateBookingStatus,
  createBooking,
  getCustomerBookingsHistory,
  getCustomerBookingDetail
};