const BookingRepository = require('../repositories/bookingRepository');
const HotelRepository = require('../repositories/hotelRepository');

const getBookingsService = async (ownerId, filters) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map(hotel => hotel._id);
  if (!hotelIds.length) {
    return { success: true, message: 'Không có khách sạn nào để xem đặt phòng', data: [] };
  }
  const bookings = await BookingRepository.findBookingsByHotelIds(hotelIds, filters);
  return { success: true, message: 'Lấy danh sách đặt phòng thành công', data: bookings };
};

const getBookingByIdService = async (ownerId, bookingId) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map(hotel => hotel._id);
  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }
  const booking = await BookingRepository.findBookingById(bookingId, hotelIds);
  if (!booking) {
    throw new Error('Đặt phòng không tồn tại hoặc bạn không có quyền truy cập');
  }
  return { success: true, message: 'Lấy chi tiết đặt phòng thành công', data: booking };
};

const confirmBookingService = async (ownerId, bookingId) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map(hotel => hotel._id);
  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }
  const booking = await BookingRepository.confirmBooking(bookingId, hotelIds);
  return { success: true, message: 'Xác nhận đặt phòng thành công', data: booking };
};

const cancelBookingService = async (ownerId, bookingId, reason) => {
  if (!reason) {
    throw new Error('Lý do hủy là bắt buộc');
  }
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map(hotel => hotel._id);
  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }
  const booking = await BookingRepository.cancelBooking(bookingId, hotelIds, reason);
  return { success: true, message: 'Hủy đặt phòng thành công', data: booking };
};

const getBookingHistoryService = async (ownerId, filters) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map(hotel => hotel._id);
  if (!hotelIds.length) {
    return { success: true, message: 'Không có khách sạn nào để xem lịch sử đặt phòng', data: [] };
  }
  const bookings = await BookingRepository.findBookingHistory(hotelIds, filters);
  return { success: true, message: 'Lấy lịch sử đặt phòng thành công', data: bookings };
};

module.exports = {
  getBookingsService,
  getBookingByIdService,
  confirmBookingService,
  cancelBookingService,
  getBookingHistoryService
};