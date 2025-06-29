const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

const findBookingsByHotelIds = async (hotelIds, filters = {}) => {
  const { status, startDate, endDate } = filters;
  const query = { hotelId: { $in: hotelIds }, type: 'hotel' };
  if (status) query.status = status;
  if (startDate || endDate) {
    query['details.checkInDate'] = {};
    if (startDate) query['details.checkInDate'].$gte = new Date(startDate);
    if (endDate) query['details.checkInDate'].$lte = new Date(endDate);
  }
  return await Booking.find(query)
    .select('userId hotelId details totalPrice status createdAt paymentInfo')
    .populate('userId', 'name email phone')
    .lean();
};

const findBookingById = async (bookingId, hotelIds) => {
  return await Booking.findOne({ _id: bookingId, hotelId: { $in: hotelIds }, type: 'hotel' })
    .select('userId hotelId details totalPrice status createdAt paymentInfo')
    .populate('userId', 'name email phone')
    .lean();
};

const createBooking = async (userId, hotelId, details, paymentMethod) => {
  try {
    const hotel = await Hotel.findOne({ _id: hotelId, status: 'active' });
    if (!hotel) throw new Error('Khách sạn không tồn tại hoặc không hoạt động');

    const { checkInDate, checkOutDate, roomType, numberOfPeople } = details;
    const room = hotel.rooms.id(roomType);
    if (!room) throw new Error('Loại phòng không tồn tại');

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    let isAvailable = true;
    let totalPrice = 0;

    const checkDate = new Date(checkIn);
    while (checkDate <= checkOut) {
      const dateString = checkDate.toISOString().split('T')[0];
      const availabilityEntry = room.availability.find(
        a => a.date.toISOString().split('T')[0] === dateString
      );
      if (!availabilityEntry || availabilityEntry.quantity < numberOfPeople) {
        isAvailable = false;
        break;
      }
      totalPrice += room.price; // Simple pricing; adjust for daily rate if needed
      checkDate.setDate(checkDate.getDate() + 1);
    }

    if (!isAvailable) throw new Error('Phòng không còn trống trong khoảng thời gian này');

    const bookingCode = `BK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const booking = new Booking({
      userId,
      type: 'hotel',
      hotelId,
      details: { checkInDate, checkOutDate, roomType, numberOfPeople, ...details },
      totalPrice,
      paymentInfo: { bookingCode, payoutStatus: 'pending', paymentMethod }
    });
    await booking.save();

    return booking;
  } catch (error) {
    throw new Error(`Lỗi khi tạo đặt phòng: ${error.message}`);
  }
};

const confirmBooking = async (bookingId, hotelIds) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, hotelId: { $in: hotelIds }, type: 'hotel', status: 'pending' },
      { status: 'confirmed', updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('userId hotelId details totalPrice status createdAt paymentInfo');
    if (!booking) throw new Error('Đặt phòng không tồn tại hoặc không thể xác nhận');

    return booking;
  } catch (error) {
    throw new Error(`Lỗi khi xác nhận đặt phòng: ${error.message}`);
  }
};

const cancelBooking = async (bookingId, hotelIds, reason) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, hotelId: { $in: hotelIds }, type: 'hotel', status: { $in: ['pending', 'confirmed'] } },
      { status: 'cancelled', 'details.cancellationReason': reason, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('userId hotelId details totalPrice status createdAt paymentInfo');
    if (!booking) throw new Error('Đặt phòng không tồn tại, không có quyền, hoặc không thể hủy');
    return booking;
  } catch (error) {
    throw new Error(`Lỗi khi hủy đặt phòng: ${error.message}`);
  }
};

const findBookingHistory = async (hotelIds, filters = {}) => {
  const { startDate, endDate } = filters;
  const query = {
    hotelId: { $in: hotelIds },
    type: 'hotel',
    status: { $in: ['completed', 'cancelled'] }
  };
  if (startDate || endDate) {
    query['details.checkInDate'] = {};
    if (startDate) query['details.checkInDate'].$gte = new Date(startDate);
    if (endDate) query['details.checkInDate'].$lte = new Date(endDate);
  }
  return await Booking.find(query)
    .select('userId hotelId details totalPrice status createdAt paymentInfo')
    .populate('userId', 'name email phone')
    .lean();
};

module.exports = {
  findBookingsByHotelIds,
  findBookingById,
  createBooking,
  confirmBooking,
  cancelBooking,
  findBookingHistory
};